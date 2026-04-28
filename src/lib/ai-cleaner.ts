import { supabase } from "@/integrations/supabase/client";
import { getActiveKeysMulti } from "@/lib/api-keys";
import { toast } from "sonner";
import type { UnifiedContact, StageConfig } from "@/types/contact";

type LogFn = (type: "info" | "success" | "warning", message: string) => void;
type PipelineStateSetter = (fn: (prev: Record<string, string>) => Record<string, string>) => void;

/**
 * Calls the clean-contacts Edge Function for a batch of contacts.
 * Handles pipeline/single mode, provider rotation, and stage tracking.
 * Extracted from useContactProcessing for better separation of concerns.
 */
export async function cleanContactsBatch(
  contacts: Partial<UnifiedContact>[],
  options: {
    mode: "single" | "pipeline";
    singleProvider: string;
    stageConfig: StageConfig;
    addLog: LogFn;
    setPipelineState: PipelineStateSetter;
    setStats: (fn: (prev: { aiCleanedCount: number }) => { aiCleanedCount: number }) => void;
    stopRef: React.MutableRefObject<boolean>;
  }
): Promise<Partial<UnifiedContact>[]> {
  const { mode, singleProvider, stageConfig, addLog, setPipelineState, setStats, stopRef } = options;

  addLog("info", `🤖 Enviando ${contacts.length} contactos a IA...`);

  const isPipeline = mode === "pipeline";
  if (isPipeline) setPipelineState(prev => ({ ...prev, cleaning: "active" }));

  const BATCH_SIZE = isPipeline ? 20 : 25;
  const result = [...contacts];
  let cleanedTotal = 0;

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    if (stopRef.current) break;
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(contacts.length / BATCH_SIZE);
    addLog("info", `🤖 Lote ${batchNum}/${totalBatches} (${batch.length} contactos)...`);

    try {
      const payload = batch.map(c => ({
        firstName: c.firstName || "", lastName: c.lastName || "",
        whatsapp: c.whatsapp || "", company: c.company || "",
        jobTitle: c.jobTitle || "", email: c.email || "",
      }));

      const body: Record<string, unknown> = {
        contacts: payload,
        provider: isPipeline ? "pipeline" : singleProvider,
        customKeys: await getActiveKeysMulti(),
      };

      if (isPipeline) {
        body.pipelineStages = stageConfig;
      }

      const { data, error } = await supabase.functions.invoke("clean-contacts", { body });

      if (error || data?.error) {
        const errMsg = error?.message || data?.error;
        if (data?.exhausted) {
          toast.error("🔴 Todas las API keys agotadas. Agregá más keys en la pestaña Config.", { duration: 10000 });
        } else {
          toast.warning(`⚠️ Lote ${batchNum}: ${errMsg}`);
        }
        addLog("warning", `Lote ${batchNum}: ${errMsg}. Sin limpiar.`);
        continue;
      }

      // Track pipeline stages
      if (data.stages && Array.isArray(data.stages)) {
        for (const stage of data.stages) {
          addLog("info", `   ⚙️ ${stage}`);
          if (stage.includes("Limpieza")) {
            setPipelineState(prev => ({ ...prev, cleaning: stage.includes("FALLO") ? "error" : "done" }));
            if (!stage.includes("FALLO")) setPipelineState(prev => ({ ...prev, verifying: "active" }));
          }
          if (stage.includes("Verificacion")) {
            setPipelineState(prev => ({ ...prev, verifying: stage.includes("FALLO") ? "error" : "done" }));
            if (!stage.includes("FALLO")) setPipelineState(prev => ({ ...prev, correcting: "active" }));
          }
          if (stage.includes("Correccion")) {
            setPipelineState(prev => ({ ...prev, correcting: stage.includes("FALLO") ? "error" : "done" }));
          }
        }
      }

      const cleaned = data.contacts || [];
      for (let j = 0; j < batch.length && j < cleaned.length; j++) {
        result[i + j] = {
          ...result[i + j],
          firstName: cleaned[j]?.firstName || result[i + j].firstName || "",
          lastName: cleaned[j]?.lastName || result[i + j].lastName || "",
          whatsapp: cleaned[j]?.whatsapp || result[i + j].whatsapp || "",
          company: cleaned[j]?.company || result[i + j].company || "",
          jobTitle: cleaned[j]?.jobTitle || result[i + j].jobTitle || "",
          email: cleaned[j]?.email || result[i + j].email || "",
          aiCleaned: true,
        };
        cleanedTotal++;
      }
      setStats(prev => ({ ...prev, aiCleanedCount: cleanedTotal }));
    } catch (err) {
      addLog("warning", `Lote ${batchNum} error: ${err}. Sin limpiar.`);
    }
    if (i + BATCH_SIZE < contacts.length) await new Promise(r => setTimeout(r, 300));
  }

  addLog("success", `✨ IA limpio ${cleanedTotal} contactos exitosamente`);
  return result;
}
