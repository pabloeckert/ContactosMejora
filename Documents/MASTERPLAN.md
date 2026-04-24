# 📋 MejoraContactos — Masterplan Integral

> **⚡ Instrucción:** Cuando el usuario diga **"documentar"**, actualizar este archivo con el estado actual del proyecto, trabajos realizados, pendientes y cualquier cambio relevante. Todos los documentos viven en `Documents/`.

**Última actualización:** 2026-04-25 05:30 GMT+8  
**Versión actual:** v10.0  
**Repo:** [pabloeckert/MejoraContactos](https://github.com/pabloeckert/MejoraContactos)  
**Live:** https://util.mejoraok.com/mejoracontactos/  
**Tests:** 174 pasando ✅ | Build: 430KB index ✅

---

## 1. Visión Ejecutiva

MejoraContactos es una SPA para limpiar, deduplicar y unificar contactos desde múltiples fuentes (CSV, Excel, VCF, JSON, Google Contacts) usando un pipeline híbrido: reglas determinísticas (80%+) + IA con 12 proveedores y rotación automática.

**Estado actual:** ✅ Core completo, ✅ Deploy funcional, ✅ 174 tests, ✅ CI/CD automático

---

## 2. Análisis Multidisciplinario (35 Roles)

### 🏗️ Área Técnica

| Rol | Veredicto | Score | Acción Principal |
|-----|-----------|-------|------------------|
| **Software Architect** | Arquitectura sólida, bajo acoplamiento | ⭐⭐⭐⭐ | Circuit breaker formal para proveedores IA |
| **Cloud Architect** | Hostinger compartido es cuello de botella | ⭐⭐⭐ | Cloudflare CDN (gratis) → futuro Vercel |
| **Backend Developer** | Edge Function robusta, rate limit in-memory | ⭐⭐⭐⭐ | Rate limit en DB, retry con backoff |
| **Frontend Developer** | Código limpio, shadcn/ui consistente | ⭐⭐⭐⭐ | Dividir useContactProcessing (407 líneas) |
| **iOS Developer** | PWA manifest + SW ya implementados | ⭐⭐⭐ | iOS standalone mode, push notifications |
| **Android Developer** | PWA funcional, install prompt pendiente | ⭐⭐⭐ | beforeinstallprompt handler |
| **DevOps Engineer** | CI/CD con rollback automático | ⭐⭐⭐⭐ | Staging environment, feature flags |
| **SRE** | Sin monitoreo real | ⭐⭐ | Sentry errores + uptime check |
| **Cybersecurity Architect** | CSP + JWT + input validation ✅ | ⭐⭐⭐⭐ | Cloudflare WAF, security audit externo |
| **Data Engineer** | IndexedDB local, sin persistencia server | ⭐⭐⭐ | Migración parcial a Supabase DB |
| **ML Engineer** | 12 proveedores IA, prompts hardcodeados | ⭐⭐⭐ | Embeddings para dedup semántica |
| **QA Automation** | 174 tests, sin E2E en CI | ⭐⭐⭐ | Playwright en GitHub Actions |
| **DBA** | IndexedDB v3 bien diseñada | ⭐⭐⭐ | Índices compuestos, TTL para snapshots |

### 📦 Área de Producto y Gestión

| Rol | Veredicto | Score | Acción Principal |
|-----|-----------|-------|------------------|
| **Product Manager** | Feature-complete pero sin tracción | ⭐⭐⭐ | Landing page SEO + Product Hunt launch |
| **Product Owner** | Backlog bien priorizado | ⭐⭐⭐⭐ | User stories para v11 (monetización) |
| **Scrum Master** | Desarrollo en sprints implícitos | ⭐⭐⭐ | Kanban board público, retrospectives |
| **UX Researcher** | Sin datos de uso real | ⭐⭐ | Analytics + heatmap (Plausible/Umami) |
| **UX Designer** | Onboarding wizard ✅, modo simple ✅ | ⭐⭐⭐⭐ | A/B test wizard vs. tutorial |
| **UI Designer** | shadcn/ui consistente, dark mode ✅ | ⭐⭐⭐⭐ | Tema personalizado con marca MejoraOK |
| **UX Writer** | Copy en español, claro | ⭐⭐⭐⭐ | Microcopy audit, tooltips mejorados |
| **Localization Manager** | i18n ES/EN/PT ✅ | ⭐⭐⭐ | Traducciones completas + auto-detección |
| **Delivery Manager** | Deploy automático con rollback | ⭐⭐⭐⭐ | Feature flags para rollouts graduales |

### 📈 Área Comercial y de Crecimiento

| Rol | Veredicto | Score | Acción Principal |
|-----|-----------|-------|------------------|
| **Growth Manager** | Sin funnel definido | ⭐⭐ | Activation funnel: visit → import → clean → export |
| **ASO Specialist** | N/A (web app) | — | PWA install prompt como alternativa |
| **Performance Marketing** | Sin presupuesto, sin ads | ⭐ | SEO orgánico como canal principal |
| **SEO Specialist** | OG tags + Schema.org ✅, sin backlinks | ⭐⭐⭐ | Blog con contenido de keywords objetivo |
| **Business Development** | Sin partnerships | ⭐⭐ | Integraciones con CRMs (HubSpot, Pipedrive) |
| **Account Manager** | Sin usuarios B2B | ⭐ | Plan Pro con soporte prioritario |
| **Content Manager** | Sin blog ni contenido | ⭐⭐ | 3 artículos SEO: "limpiar contactos", "deduplicar CSV" |
| **Community Manager** | Sin presencia social | ⭐ | Twitter/X + Product Hunt launch |

### ⚖️ Área de Operaciones, Legal y Análisis

| Rol | Veredicto | Score | Acción Principal |
|-----|-----------|-------|------------------|
| **BI Analyst** | Analytics básico (localStorage) | ⭐⭐ | Migrar a Plausible/Umami (GDPR-safe) |
| **Data Scientist** | Sin datos de usuarios para analizar | ⭐ | Event tracking: funnel conversion rates |
| **Legal & Compliance** | Privacy + Terms ✅ | ⭐⭐⭐⭐ | Cookie consent si se usa analytics |
| **DPO** | GDPR compliant (datos en cliente) | ⭐⭐⭐⭐ | Data retention policy documentada |
| **Customer Success** | Sin canal de soporte | ⭐⭐ | FAQ + chat widget (Crisp/Tawk.to) |
| **Technical Support T1** | Sin base de conocimiento | ⭐⭐ | Help center con guías paso a paso |
| **Technical Support T2** | Sin ticketing | ⭐⭐ | Email de soporte + template responses |
| **Technical Support T3** | Devs directos | ⭐⭐⭐ | GitHub Issues como ticketing técnico |
| **RevOps** | Sin revenue, sin pipeline | ⭐ | Definir pricing antes de monetizar |

---

## 3. Plan por Etapas (Optimizado)

### ✅ Completado (v1.0 → v10.0)

| Etapa | Descripción | Versión | Fecha |
|-------|------------|---------|-------|
| Core | Pipeline IA completo, dedup, exportación | v3.0 | 2026-04-22 |
| Security | CSP, JWT, input validation, ErrorBoundary | v6.0 | 2026-04-24 |
| UX | Onboarding wizard, modo simple, preview, skeletons | v7.0 | 2026-04-24 |
| Performance | PWA, Web Worker, CDN guide, rollback deploy | v8.0 | 2026-04-24 |
| Testing | E2E Playwright, coverage, a11y, performance budget | v9.0 | 2026-04-24 |
| Growth | Landing page, SEO, i18n, fine-tuning JSONL | v10.0 | 2026-04-24 |

### 📋 Pendiente — Etapa 11: Verificación y Estabilización (SEMANA 1)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 11.1 | Verificar funcionalidad en producción | SRE, QA | 🔴 Crítica | ⏳ |
| 11.2 | Test pipeline completo con CSV real | QA, Product Owner | 🔴 Crítica | ⏳ |
| 11.3 | Test todos los proveedores IA con keys reales | Backend Dev | 🟡 Alta | ⏳ |
| 11.4 | Monitoreo: Sentry para errores de producción | SRE | 🟡 Alta | ⏳ |
| 11.5 | Uptime check (cron que verifique HTTP 200) | DevOps | 🟡 Alta | ⏳ |
| 11.6 | Cloudflare CDN + SSL | Cloud Architect | 🟢 Media | ⏳ |

### 📋 Pendiente — Etapa 12: UX y Monetización (SEMANA 2)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 12.1 | Analytics: Plausible o Umami (GDPR-safe) | BI Analyst, DPO | 🟡 Alta | ⏳ |
| 12.2 | Funnel tracking: visit → import → clean → export | Growth Manager | 🟡 Alta | ⏳ |
| 12.3 | Pricing page: Free vs Pro | Product Manager | 🟡 Alta | ⏳ |
| 12.4 | Límites Free: 500 contacts/lote, 3 lotes/día | Backend Dev | 🟡 Alta | ⏳ |
| 12.5 | Plan Pro: ilimitado + prioridad en IA | Product Owner | 🟢 Media | ⏳ |
| 12.6 | Cookie consent banner | Legal, Frontend | 🟢 Media | ⏳ |

### 📋 Pendiente — Etapa 13: Crecimiento (SEMANA 3)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 13.1 | Blog SEO: 3 artículos clave | Content Manager | 🟡 Alta | ⏳ |
| 13.2 | Product Hunt launch | Growth Manager | 🟡 Alta | ⏳ |
| 13.3 | Twitter/X presencia | Community Manager | 🟢 Media | ⏳ |
| 13.4 | FAQ + Help Center | Customer Success | 🟢 Media | ⏳ |
| 13.5 | Chat widget (Crisp o Tawk.to) | Technical Support T1 | 🟢 Media | ⏳ |

### 📋 Pendiente — Etapa 14: Escalabilidad (SEMANA 4+)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 14.1 | Circuit breaker formal para proveedores IA | Software Architect | 🟢 Media | ⏳ |
| 14.2 | Rate limit en Supabase DB (cross-instance) | Backend Dev | 🟢 Media | ⏳ |
| 14.3 | Embeddings para dedup semántica | ML Engineer | 🔵 Futuro | ⏳ |
| 14.4 | Migración parcial a Supabase DB | Data Engineer | 🔵 Futuro | ⏳ |
| 14.5 | Integraciones CRM (HubSpot, Pipedrive) | Business Dev | 🔵 Futuro | ⏳ |
| 14.6 | App nativa iOS/Android | Mobile Devs | 🔵 Futuro | ⏳ |

---

## 4. Arquitectura Actual

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   GitHub        │────▶│  GitHub Actions   │────▶│  Hostinger VPS  │
│   (source)      │     │  (CI/CD)          │     │  (SSH/SCP)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                  ┌───────▼───────┐
                                                  │ Static files  │
                                                  │ + .htaccess   │
                                                  └───────────────┘

┌─────────────────┐     ┌──────────────────┐
│  Browser        │────▶│  Supabase Edge   │
│  (React SPA)    │     │  Functions (Deno)│
│  (IndexedDB)    │     └──────────────────┘
└─────────────────┘
```

### Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui (Radix) |
| Persistencia local | IndexedDB via `idb` |
| Backend (IA) | Supabase Edge Functions (Deno) |
| Telefónica | `libphonenumber-js` (E.164) |
| Parsing | PapaParse (CSV), SheetJS (Excel), parser propio (VCF) |
| Virtualización | `@tanstack/react-virtual` |
| Deploy | GitHub Actions → SSH+SCP → Hostinger |
| Supabase | Proyecto `tzatuvxatsduuslxqdtm` |

### Proveedores IA (12)

Groq ✅ · OpenRouter ✅ · Together · Cerebras · DeepInfra · SambaNova · Mistral · DeepSeek · Gemini · Cloudflare · Hugging Face · Nebius

---

## 5. Funcionalidades

### Importación
- CSV, Excel (lazy), VCF, JSON, Google Contacts (OAuth multi-cuenta)

### Pipeline
```
Parseo → Mapeo → Reglas (80%) → IA Limpieza → IA Verificación → IA Corrección → Validación → Dedup
```

### Exportación
- CSV, Excel, VCF, JSON, JSONL (fine-tuning), HTML (informes)

### UI
- Dark mode, tabla virtualizada, responsive, onboarding wizard, modo simple/avanzado

---

## 6. Infraestructura

| Servicio | Detalle |
|----------|---------|
| Hosting | Hostinger (FTP: 185.212.70.250, SSH: puerto 65002) |
| Ruta server | `/home/u846064658/domains/mejoraok.com/public_html/util/mejoracontactos/` |
| Supabase | `tzatuvxatsduuslxqdtm` |
| DNS | `util.mejoraok.com` → Hostinger |
| GitHub Secrets | `SSH_HOST`, `SSH_USER`, `SSH_PASS`, `SSH_PORT` |

---

## 7. Convenciones

- **Idioma:** UI en español, código en inglés
- **Documentación:** Todo en `Documents/` (este archivo es el master)
- **"documentar":** Actualiza este DOCS.md con el estado actual
- **Commits:** `tipo: descripción` (feat, fix, docs, chore, ci, perf)
- **Git config:** `MejoraContactos Bot <bot@mejoraok.com>`
- **Branch:** `main` (deploy automático)
- **NO commitear:** `.env`, tokens, API keys, `supabase/.temp`

---

## 8. Comandos Rápidos

```bash
# Desarrollo
cd MejoraContactos && npm install --legacy-peer-deps && npm run dev

# Tests
npx vitest run                    # 174 tests

# Build
npx vite build                    # producción

# Deploy frontend (automático al pushear)
git push origin main

# Deploy Edge Functions (manual)
npx supabase functions deploy clean-contacts
npx supabase functions deploy google-contacts-auth
```

---

## 9. Registro de Cambios (Últimas versiones)

| Versión | Fecha | Cambios principales |
|---------|-------|-------------------|
| v10.0 | 2026-04-24 | Landing page, SEO, i18n, fine-tuning JSONL |
| v9.0 | 2026-04-24 | E2E Playwright, coverage, a11y, perf budget |
| v8.0 | 2026-04-24 | PWA, Web Worker, CDN guide, rollback deploy |
| v7.0 | 2026-04-24 | Onboarding wizard, modo simple, preview, skeletons |
| v6.0 | 2026-04-24 | CSP headers, JWT, input validation, Privacy/Terms |
| v5.0 | 2026-04-24 | Health Check, Historial/Undo |

---

## 10. Archivos Clave

| Archivo | Qué hace |
|---------|----------|
| `src/hooks/useContactProcessing.ts` | Lógica central del pipeline |
| `src/lib/providers.ts` | Config de 12 proveedores IA |
| `src/lib/db.ts` | IndexedDB v3 |
| `src/lib/dedup.ts` | Deduplicación O(n) + Jaro-Winkler |
| `src/lib/rule-cleaner.ts` | Limpieza determinística |
| `supabase/functions/clean-contacts/index.ts` | Edge Function: limpieza IA |
| `Documents/DOCS.md` | Documentación consolidada |
| `Documents/PROMPT.md` | Prompt de continuidad |

---

*Documento maestro — consolidación de toda la documentación del proyecto. Actualizar al decir "documentar".*
