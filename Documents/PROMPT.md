# 🤖 Prompt de Continuidad — MejoraContactos

> **Instrucción:** Cuando inicies una sesión y el usuario mencione "MejoraContactos", leé este archivo primero para retomar contexto completo sin perder tiempo.

---

## ¿Qué es esto?

Sos el asistente de desarrollo del proyecto **MejoraContactos** — una app web para limpiar, deduplicar y unificar bases de contactos con IA.

**Repo:** https://github.com/pabloeckert/MejoraContactos  
**Live:** https://util.mejoraok.com/mejoracontactos/  
**Documentación completa:** `Documents/MASTERPLAN.md` (archivo principal) + `Documents/DOCS.md` (técnica)

## Contexto rápido

- **Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Supabase Edge Functions
- **12 proveedores de IA** con rotación automática de keys
- **Pipeline:** Parseo → Mapeo → Reglas (80%) → IA Limpieza → IA Verificación → IA Corrección → Validación → Dedup
- **Deploy:** Push a `main` → GitHub Actions → build + test → SCP a Hostinger (automático)
- **Edge Functions:** Se deployan manualmente con Supabase CLI
- **Tests:** 150+ tests, `npm test`
- **Bundle:** ~389KB index (lazy xlsx, chunks separados)

## Estado actual (v5.0 — 2026-04-24)

- ✅ Core completo (pipeline IA, dedup, exportación 6 formatos, Google Contacts)
- ✅ Deploy funcional en producción
- ✅ 12 proveedores IA configurados (Groq y OpenRouter verificados)
- ✅ Health Check de proveedores (test masivo con latencia)
- ✅ Historial/Undo (snapshots antes de cada limpieza)
- ✅ 150 tests pasando
- ✅ Código limpio (proveedor "lovable" obsoleto eliminado)

## Pendientes (próximas etapas)

| Etapa | Tarea | Estado |
|-------|-------|--------|
| 6.3 | Test pipeline end-to-end con CSV real | ⏳ Necesita usuario |
| 6.4 | Test otros proveedores (keys de Together, Cerebras, etc.) | ⏳ Opcional |
| 6.5 | Test Google OAuth importación | ⏳ Necesita usuario |
| 7.2 | Monitoreo Edge Functions (logs Supabase) | ⏳ Pendiente |
| 8.1 | PWA offline (service worker + manifest) | ⏳ Pendiente |
| 8.2 | Batch progress real (streaming desde Edge Function) | ⏳ Pendiente |
| 8.3 | Exportación programada (auto-export post-limpieza) | ⏳ Pendiente |

## Comandos útiles

```bash
# Desarrollo
cd MejoraContactos && npm run dev    # localhost:8080

# Tests
npm test                              # 150 tests

# Build
npm run build                         # producción

# Deploy Edge Functions (manual)
npx supabase login --token sbp_XXXXX
npx supabase link --project-ref tzatuvxatsduuslxqdtm
npx supabase functions deploy clean-contacts
npx supabase functions deploy google-contacts-auth

# Deploy frontend (automático al pushear)
git push origin main
```

## Infraestructura

| Servicio | Detalle |
|----------|---------|
| Hosting | Hostinger (SSH puerto 65002, usuario `u846064658`) |
| Ruta server | `/home/u846064658/domains/mejoraok.com/public_html/util/mejoracontactos/` |
| Supabase | Proyecto `tzatuvxatsduuslxqdtm` |
| DNS | `util.mejoraok.com` → Hostinger |
| GitHub Secrets | `SSH_HOST`, `SSH_USER`, `SSH_PASS`, `SSH_PORT` |

## Convenciones del proyecto

- **Idioma:** UI en español, código en inglés
- **Documentación:** Todo vive en `Documents/DOCS.md` (consolidado)
- **"documentar":** Cuando el usuario diga esta palabra, actualizá `DOCS.md` con el estado actual
- **Commits:** Formato `tipo: descripción` (feat, fix, docs, chore, ci, perf)
- **Git config:** `MejoraContactos Bot <bot@mejoraok.com>`
- **Branch:** `main` (deploy automático)
- **NO commitear:** `.env`, tokens, API keys, `supabase/.temp`

## Archivos clave

| Archivo | Qué hace |
|---------|----------|
| `src/hooks/useContactProcessing.ts` | Lógica central del pipeline (397 líneas) |
| `src/lib/providers.ts` | Config de 12 proveedores IA |
| `src/lib/db.ts` | IndexedDB v3 (contacts + history) |
| `src/lib/dedup.ts` | Deduplicación O(n) + Jaro-Winkler |
| `src/lib/rule-cleaner.ts` | Limpieza determinística (80%+) |
| `src/lib/ai-validator.ts` | Validación IA con cache |
| `src/components/ProcessingPanel.tsx` | UI del pipeline |
| `src/pages/Index.tsx` | Página principal (6 tabs) |
| `supabase/functions/clean-contacts/index.ts` | Edge Function: limpieza IA |
| `Documents/DOCS.md` | Documentación consolidada |
| `Documents/PROMPT.md` | Este archivo |

## Lo que NO hacer

- ❌ No instalar dependencias nuevas sin preguntar
- ❌ No modificar `supabase/config.toml` ni las credenciales
- ❌ No hacer deploy de Edge Functions sin confirmar
- ❌ No romper los 150 tests existentes
- ❌ No agregar proveedores obsoletos ("lovable" fue eliminado por una razón)
- ❌ No usar `rm -r` — usar `trash` o preguntar

---

*Siempre actualizá este archivo cuando haya cambios significativos en el proyecto.*
