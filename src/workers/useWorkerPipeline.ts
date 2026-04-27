/**
 * Helper to offload CPU-intensive pipeline ops to a Web Worker.
 * Falls back to inline processing for small datasets.
 */

const WORKER_THRESHOLD = 10000; // Use worker for 10K+ contacts

interface RuleCleanResult {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  company: string;
  jobTitle: string;
  needsAI: boolean;
}

interface DedupResult {
  id: string;
  isDuplicate: boolean;
  duplicateOf?: string;
  confidence: number;
}

function createWorker(): Worker | null {
  try {
    return new Worker(new URL("./pipeline.worker.ts", import.meta.url), { type: "module" });
  } catch {
    return null;
  }
}

export function runRuleCleanInWorker(
  contacts: Record<string, string>[],
  onProgress?: (processed: number, total: number) => void
): Promise<{ cleaned: RuleCleanResult[]; aiIndices: number[] }> {
  if (contacts.length < WORKER_THRESHOLD) {
    // Import inline for small datasets
    return import("@/lib/rule-cleaner").then(({ batchRuleClean }) => {
      const result = batchRuleClean(contacts as Record<string, string>[]);
      return { cleaned: result.cleaned as unknown as RuleCleanResult[], aiIndices: result.aiIndices };
    });
  }

  return new Promise((resolve, reject) => {
    const worker = createWorker();
    if (!worker) {
      // Fallback to inline
      import("@/lib/rule-cleaner").then(({ batchRuleClean }) => {
        const result = batchRuleClean(contacts as Record<string, string>[]);
        resolve({ cleaned: result.cleaned as unknown as RuleCleanResult[], aiIndices: result.aiIndices });
      });
      return;
    }

    worker.onmessage = (e) => {
      if (e.data.type === "progress" && onProgress) {
        onProgress(e.data.processed, e.data.total);
      }
      if (e.data.type === "ruleClean:done") {
        worker.terminate();
        resolve({ cleaned: e.data.cleaned, aiIndices: e.data.aiIndices });
      }
    };

    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(`Worker error: ${e.message}`));
    };

    worker.postMessage({ type: "ruleClean", contacts });
  });
}

export function runDedupInWorker(
  contacts: Record<string, string>[],
  onProgress?: (processed: number, total: number) => void
): Promise<DedupResult[]> {
  if (contacts.length < WORKER_THRESHOLD) {
    return import("@/lib/dedup").then(({ DedupIndex }) => {
      const index = new DedupIndex();
      return contacts.map((c) =>
        index.add({ id: c.id || "", firstName: c.firstName || "", lastName: c.lastName || "", email: c.email || "", whatsapp: c.whatsapp || "" })
      );
    });
  }

  return new Promise((resolve, reject) => {
    const worker = createWorker();
    if (!worker) {
      import("@/lib/dedup").then(({ DedupIndex }) => {
        const index = new DedupIndex();
        resolve(contacts.map((c) =>
          index.add({ id: c.id || "", firstName: c.firstName || "", lastName: c.lastName || "", email: c.email || "", whatsapp: c.whatsapp || "" })
        ));
      });
      return;
    }

    worker.onmessage = (e) => {
      if (e.data.type === "progress" && onProgress) {
        onProgress(e.data.processed, e.data.total);
      }
      if (e.data.type === "dedup:done") {
        worker.terminate();
        resolve(e.data.results);
      }
    };

    worker.onerror = (e) => {
      worker.terminate();
      reject(new Error(`Worker error: ${e.message}`));
    };

    worker.postMessage({ type: "dedup", contacts });
  });
}
