# MejoraApp

Limpieza, deduplicación y unificación de contactos con IA.

## Descripción

MejoraApp es una aplicación web especializada en consolidar, limpiar y deduplicar bases de contactos de múltiples fuentes heterogéneas (CSV, Excel, VCF, JSON, Google Contacts).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Edge Functions (Deno)
- 12 proveedores de IA con rotación automática
- IndexedDB (Dexie) para persistencia local

## Funcionalidades

- Importación desde CSV, Excel, VCF, JSON y Google Contacts (OAuth)
- Mapeo automático de columnas con muestras aleatorias del dataset
- Pipeline de limpieza híbrido: reglas determinísticas + IA en cascada (3 etapas)
- Detección de duplicados con Jaro-Winkler
- Normalización telefónica internacional (E.164)
- 12 proveedores de IA con rotación automática y múltiples keys
- Exportación a CSV, Excel, VCF y JSON
- Dashboard con métricas en tiempo real

## Proveedores de IA soportados

1. Groq Cloud (Llama 3.3)
2. OpenRouter (Mistral Small Free)
3. Together AI (Llama 3.3)
4. Cerebras (Llama 3.3)
5. DeepInfra (Llama 3.3)
6. SambaNova (Llama 3.3)
7. Mistral AI (Small)
8. DeepSeek Chat
9. Google AI Studio (Gemini)
10. Cloudflare Workers AI
11. Hugging Face Inference
12. Nebius AI

## Documentación

Ver el informe completo en `documents/Informe_MejoraApp_v2.docx`.

## Deploy

```bash
npm install
npm run dev
```

Para producción, desplegar en Lovable Cloud o cualquier hosting compatible con Vite.
