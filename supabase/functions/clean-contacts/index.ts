import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface RawContact {
  firstName?: string;
  lastName?: string;
  whatsapp?: string;
  company?: string;
  jobTitle?: string;
  email?: string;
}

type Provider = "lovable" | "groq" | "openrouter";

interface ProviderConfig {
  url: string;
  apiKey: string;
  model: string;
  name: string;
}

function getProviderConfig(provider: Provider): ProviderConfig {
  switch (provider) {
    case "groq": {
      const key = Deno.env.get("GROQ_API_KEY");
      if (!key) throw new Error("GROQ_API_KEY no configurada");
      return {
        url: "https://api.groq.com/openai/v1/chat/completions",
        apiKey: key,
        model: "llama-3.3-70b-versatile",
        name: "Groq (Llama 3.3 70B)",
      };
    }
    case "openrouter": {
      const key = Deno.env.get("OPENROUTER_API_KEY");
      if (!key) throw new Error("OPENROUTER_API_KEY no configurada");
      return {
        url: "https://openrouter.ai/api/v1/chat/completions",
        apiKey: key,
        model: "mistralai/mistral-small-3.2-24b-instruct:free",
        name: "OpenRouter (Mistral Small Free)",
      };
    }
    default: {
      const key = Deno.env.get("LOVABLE_API_KEY");
      if (!key) throw new Error("LOVABLE_API_KEY no configurada");
      return {
        url: "https://ai.gateway.lovable.dev/v1/chat/completions",
        apiKey: key,
        model: "google/gemini-3-flash-preview",
        name: "Lovable AI (Gemini Flash)",
      };
    }
  }
}

const SYSTEM_PROMPT = "Sos un limpiador de datos. Respondé SOLO con JSON válido, sin markdown, sin explicaciones.";

function buildPrompt(batch: RawContact[]): string {
  return `Sos un asistente experto en limpieza de datos de contactos.
Recibís un array JSON de contactos desordenados. Tu tarea:

1. **Nombre**: Capitalizar correctamente (primera letra mayúscula). Si hay nombre completo en un solo campo, separar en firstName y lastName.
2. **Apellido**: Capitalizar correctamente.
3. **WhatsApp**: Convertir a formato internacional sin espacios ni guiones, solo números con código de país. Si no tiene código de país, asumir +54 (Argentina). Ejemplo: "+5491112345678". Eliminar el 15 si es un celular argentino (ej: 011-15-1234-5678 → +5491112345678).
4. **Empresa**: Limpiar y capitalizar. Quitar basura como "N/A", "-", ".", etc.
5. **Cargo**: Limpiar y capitalizar. Quitar basura.
6. **Email**: Limpiar, minúsculas, validar formato básico. Si es inválido, dejar vacío.

IMPORTANTE:
- Si un campo tiene basura irreconocible, dejarlo vacío "".
- NO inventar datos. Si no hay información, dejar vacío.
- Devolvé SOLO el array JSON limpio, sin explicaciones.

Contactos a limpiar:
${JSON.stringify(batch)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contacts, provider: providerParam } = await req.json() as {
      contacts: RawContact[];
      provider?: Provider;
    };

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return new Response(JSON.stringify({ error: "No contacts provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const provider = providerParam || "lovable";
    let config: ProviderConfig;
    try {
      config = getProviderConfig(provider);
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Using provider: ${config.name} for ${contacts.length} contacts`);

    const batchSize = 25;
    const allCleaned: RawContact[] = [];

    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);

      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
          ...(provider === "openrouter" ? { "HTTP-Referer": "https://lovable.dev" } : {}),
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildPrompt(batch) },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: `Rate limit en ${config.name}. Intentá de nuevo en unos segundos.` }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Créditos agotados." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const errText = await response.text();
        console.error(`${config.name} error:`, response.status, errText);
        allCleaned.push(...batch);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";

      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const cleaned = JSON.parse(jsonMatch[0]);
          allCleaned.push(...cleaned);
        } else {
          allCleaned.push(...batch);
        }
      } catch {
        console.error("Failed to parse AI response:", content);
        allCleaned.push(...batch);
      }
    }

    return new Response(JSON.stringify({ contacts: allCleaned, provider: config.name }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("clean-contacts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
