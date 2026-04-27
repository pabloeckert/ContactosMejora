# 🤖 Prompt de Continuidad — MejoraContactos

> **Instrucción:** Cuando inicies una sesión y el usuario mencione "MejoraContactos", leé este archivo primero para retomar contexto completo.

## ¿Qué es esto?

Sos el asistente de desarrollo del proyecto **MejoraContactos** — una app web para limpiar, deduplicar y unificar bases de contactos con IA.

**Repo:** https://github.com/pabloeckert/MejoraContactos  
**Live:** https://util.mejoraok.com/mejoracontactos/  
**Documentación completa:** `Documents/MASTERPLAN.md` (archivo único)

## Contexto rápido

- **Stack:** React 18 + Vite + TypeScript + Tailwind + shadcn/ui + Supabase Edge Functions
- **12 proveedores de IA** con rotación automática de keys
- **Pipeline:** Parseo → Mapeo → Reglas (80%) → IA Limpieza → IA Verificación → IA Corrección → Validación → Dedup
- **Deploy:** Push a `main` → GitHub Actions → build + test → SCP a Hostinger (automático)
- **Edge Functions:** Se deployan manualmente con Supabase CLI
- **Tests:** 174 tests, `npx vitest run`
- **Bundle:** ~389KB index (lazy xlsx, chunks separados)

## Estado actual (v10.3 — 2026-04-28)

- ✅ Core completo (pipeline IA, dedup, exportación 6 formatos, Google Contacts)
- ✅ Deploy funcional en producción
- ✅ 12 proveedores IA configurados (Groq y OpenRouter verificados)
- ✅ Health Check de proveedores
- ✅ Historial/Undo con snapshots (también con procesamiento por reglas)
- ✅ 174 tests pasando
- ✅ PWA (manifest + service worker)
- ✅ Landing page + SEO (OG tags, Schema.org)
- ✅ i18n (ES/EN/PT)
- ✅ Onboarding wizard + modo simple/avanzado
- ✅ CSP headers + JWT auth + input validation
- ✅ Privacy Policy + Terms of Service
- ✅ Error Reporter v2 (unhandled errors + webhook + Edge Function)
- ✅ Health endpoint (health.json)
- ✅ Uptime monitoring (cron cada 5 min)
- ✅ CSV encoding fix (UTF-8 + BOM)
- ✅ Regex column mapper robusto

## Pendientes principales

| Etapa | Tarea | Estado |
|-------|-------|--------|
| 11.3 | Test proveedores IA con keys reales | ⏳ |
| 11.4 | Sentry para errores de producción | ⏳ |
| 11.7 | Fix bug: "Teléfono" en dropdown mapeo | ⏳ |
| 12.1 | Analytics: Plausible/Umami | ⏳ |
| 12.3 | Pricing page: Free vs Pro | ⏳ |
| 13.1 | Blog SEO: 3 artículos clave | ⏳ |
| 13.2 | Product Hunt launch | ⏳ |

## Comandos útiles

```bash
cd MejoraContactos && npm install --legacy-peer-deps && npm run dev
npx vitest run
npx vite build
git push origin main
npx supabase functions deploy clean-contacts
```

## Convenciones

- **"documentar":** Actualiza `Documents/MASTERPLAN.md` con el estado actual
- **Commits:** `tipo: descripción` (feat, fix, docs, chore, ci, perf)
- **Git config:** `MejoraContactos Bot <bot@mejoraok.com>`
- **NO commitear:** `.env`, tokens, API keys

## Lo que NO hacer

- ❌ No instalar dependencias nuevas sin preguntar
- ❌ No modificar `supabase/config.toml` ni credenciales
- ❌ No hacer deploy de Edge Functions sin confirmar
- ❌ No romper los 174 tests existentes
- ❌ No usar `rm -r` — usar `trash` o preguntar

---

*Siempre actualizá este archivo cuando haya cambios significativos. Documentación completa en `Documents/MASTERPLAN.md`.*
