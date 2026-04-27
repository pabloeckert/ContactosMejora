# 📋 MejoraContactos — Masterplan Integral

> **⚡ Instrucción:** Cuando el usuario diga **"documentar"**, actualizar este archivo con el estado actual del proyecto, trabajos realizados, pendientes y cualquier cambio relevante. Todos los documentos viven en `Documents/`.

**Última actualización:** 2026-04-28 05:50 GMT+8  
**Versión actual:** v10.1  
**Commit HEAD:** (pending)  
**Repo:** [pabloeckert/MejoraContactos](https://github.com/pabloeckert/MejoraContactos)  
**Live:** https://util.mejoraok.com/mejoracontactos/  
**Tests:** 174 pasando ✅ | Build: OK ✅

---

## Tabla de Contenidos

1. [Visión Ejecutiva](#1-visión-ejecutiva)
2. [Stack y Arquitectura](#2-stack-y-arquitectura)
3. [Funcionalidades](#3-funcionalidades)
4. [Pipeline de Procesamiento](#4-pipeline-de-procesamiento)
5. [Proveedores IA](#5-proveedores-ia)
6. [Análisis Multidisciplinario (35 Roles)](#6-análisis-multidisciplinario-35-roles)
7. [Plan por Etapas](#7-plan-por-etapas)
8. [Infraestructura y Deploy](#8-infraestructura-y-deploy)
9. [Seguridad](#9-seguridad)
10. [Registro de Cambios](#10-registro-de-cambios)
11. [Archivos Clave](#11-archivos-clave)
12. [Comandos Rápidos](#12-comandos-rápidos)
13. [Convenciones](#13-convenciones)

---

## 1. Visión Ejecutiva

MejoraContactos es una SPA para limpiar, deduplicar y unificar contactos desde múltiples fuentes (CSV, Excel, VCF, JSON, Google Contacts) usando un pipeline híbrido: reglas determinísticas (80%+) + IA con 12 proveedores y rotación automática.

**Estado actual:** ✅ Core completo | ✅ Deploy funcional | ✅ 174 tests | ✅ CI/CD automático | ✅ PWA | ✅ SEO | ✅ i18n

**Diferenciadores clave:**
- 12 proveedores IA con rotación automática (resiliencia)
- Pipeline híbrido: reglas (80%) + IA (20%) = rápido + inteligente
- Gratuito (el usuario paga solo la API que usa)
- Privacy-first: todo procesa en el browser del usuario
- Multi-formato: 5 formatos de entrada, 6 de salida

---

## 2. Stack y Arquitectura

### Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| UI | Tailwind CSS + shadcn/ui (Radix) |
| Persistencia local | IndexedDB via `idb` |
| Backend (IA) | Supabase Edge Functions (Deno) |
| Telefónica | `libphonenumber-js` (E.164) |
| Parsing | PapaParse (CSV), SheetJS (Excel), parser propio (VCF) |
| Virtualización | `@tanstack/react-virtual` |
| Temas | `next-themes` (dark/light) |
| Gráficos | Recharts |
| Deploy frontend | GitHub Actions → SSH+SCP → Hostinger |
| Deploy Edge Functions | Supabase CLI (`npx supabase functions deploy`) |
| Supabase project | `tzatuvxatsduuslxqdtm` |

### Arquitectura

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

### Estructura de Directorios

```
src/
├── components/          # UI components (20+)
│   ├── ui/              # shadcn/ui base components
│   ├── ColumnMapper.tsx # Mapeo manual de columnas
│   ├── ContactsTable.tsx# Tabla virtualizada con scores
│   ├── DashboardPanel.tsx# Métricas y gráficos
│   ├── ExportPanel.tsx  # Exportación multi-formato
│   ├── FileDropzone.tsx # Drag & drop
│   ├── GoogleContactsPanel.tsx # OAuth multi-cuenta
│   ├── HealthCheckPanel.tsx # Test API keys
│   ├── HistoryPanel.tsx # Historial + undo
│   ├── OnboardingWizard.tsx # Wizard 3 pasos
│   ├── PipelineVisualizer.tsx # Tracker visual
│   ├── PreviewPanel.tsx # Vista previa pre-proceso
│   ├── ProcessingPanel.tsx # Pipeline UI shell
│   └── SimpleMode.tsx   # Modo simple/avanzado
├── hooks/
│   ├── useContactProcessing.ts # Lógica central pipeline (407 líneas)
│   ├── usePipelineConfig.ts    # Config pipeline
│   └── use-toast.ts
├── lib/
│   ├── ai-cleaner.ts    # Limpieza IA
│   ├── ai-validator.ts  # Validación IA con cache
│   ├── analytics.ts     # Tracking eventos
│   ├── api-keys.ts      # Gestión API keys
│   ├── column-mapper.ts # Auto-detección columnas
│   ├── db.ts            # IndexedDB v3
│   ├── dedup.ts         # Deduplicación O(n)
│   ├── error-reporter.ts# Error tracking
│   ├── export-utils.ts  # Exportación 6 formatos
│   ├── field-validator.ts# Validación semántica
│   ├── fine-tuning.ts   # JSONL fine-tuning
│   ├── i18n.ts          # Internacionalización
│   ├── parsers.ts       # Parseo multi-formato
│   ├── phone-validator.ts# Validación telefónica
│   ├── providers.ts     # Config 12 proveedores IA
│   ├── rule-cleaner.ts  # Limpieza determinística
│   └── utils.ts         # Utilidades
├── workers/
│   ├── pipeline.worker.ts # Web Worker batch+dedup
│   └── useWorkerPipeline.ts
├── types/
│   └── contact.ts       # Interfaces principales
├── pages/
│   ├── Index.tsx        # Página principal (6 tabs)
│   ├── Landing.tsx      # Landing page SEO
│   ├── Privacy.tsx      # Política de privacidad
│   ├── Terms.tsx        # Términos de servicio
│   └── NotFound.tsx     # 404
└── integrations/
    └── supabase/
        ├── client.ts    # Cliente Supabase
        └── types.ts     # Tipos DB

supabase/
├── config.toml
└── functions/
    ├── clean-contacts/index.ts     # Edge Function: limpieza IA
    └── google-contacts-auth/       # Edge Function: OAuth Google
```

---

## 3. Funcionalidades

### Importación
- CSV (PapaParse, UTF-8 auto-detect)
- Excel (SheetJS lazy-loaded)
- VCF (parser propio, vCard 3.0, multi-teléfono)
- JSON (array u objeto con array)
- Google Contacts (OAuth multi-cuenta, hasta 5)

### Pipeline de Limpieza
```
Parseo → Mapeo → Reglas (80%) → IA Limpieza → IA Verificación → IA Corrección → Validación → Dedup
```

### Exportación
| Formato | Uso |
|---------|-----|
| CSV | Google Contacts, Excel |
| Excel | 2 hojas (limpios + descartados) |
| VCF | vCard 3.0 para dispositivos |
| JSON | Datos completos con metadata |
| JSONL | Fine-tuning IA (OpenAI/HuggingFace) |
| HTML | Informe imprimible (XSS-safe) |

### UI
- Dark mode (next-themes)
- Tabla virtualizada (@tanstack/react-virtual)
- Responsive
- Onboarding wizard (3 pasos)
- Modo simple/avanzado
- Pipeline visualizer
- Health Check de proveedores
- Historial/Undo con snapshots

---

## 4. Pipeline de Procesamiento

```
┌─────────┐    ┌─────────┐    ┌──────────────┐    ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌───────┐
│ Archivos │───▶│ Mapeo   │───▶│ Reglas (80%) │───▶│ IA Limp. │───▶│ IA Verif. │───▶│ IA Corr.  │───▶│ Dedup │
│ (parse)  │    │ columnas│    │ deterministic│    │ (cascade)│    │ (review)  │    │ (fix)     │    │ O(n)  │
└─────────┘    └─────────┘    └──────────────┘    └──────────┘    └───────────┘    └───────────┘    └───────┘
                                                    │
                                              ┌─────▼─────┐
                                              │ Validación │
                                              │ determin.+IA│
                                              └───────────┘
```

**Etapas:**
1. **Parseo:** CSV/Excel/VCF/JSON → `ParsedFile` con filas y columnas
2. **Mapeo:** Auto-detección de columnas (nombre, email, teléfono, empresa, cargo)
3. **Reglas:** Limpieza determinística — junk removal, title case, email regex, phone E.164, auto-split nombres
4. **IA Limpieza:** Solo contactos que las reglas no resolvieron (batch 20-25)
5. **IA Verificación:** Revisión cruzada por segunda IA
6. **IA Corrección:** Fix de issues detectados
7. **Validación:** Scoring semántico por campo (0-100) + IA para ambiguos
8. **Dedup:** Email exacto O(1) → teléfono O(1) → nombre Jaro-Winkler acotado O(k)

---

## 5. Proveedores IA

| # | ID | Proveedor | Modelo | Estado |
|---|-----|----------|--------|--------|
| 1 | groq | Groq Cloud | llama-3.3-70b-versatile | ✅ Verificado |
| 2 | openrouter | OpenRouter | llama-3.3-70b-instruct:free | ✅ Verificado (rate limit temporal) |
| 3 | together | Together AI | Llama-3.3-70B-Instruct-Turbo-Free | ⏳ Pendiente |
| 4 | cerebras | Cerebras | llama-3.3-70b | ⏳ Pendiente |
| 5 | deepinfra | DeepInfra | Llama-3.3-70B-Instruct | ⏳ Pendiente |
| 6 | sambanova | SambaNova | Meta-Llama-3.3-70B-Instruct | ⏳ Pendiente |
| 7 | mistral | Mistral AI | mistral-small-latest | ⏳ Pendiente |
| 8 | deepseek | DeepSeek | deepseek-chat | ⏳ Pendiente |
| 9 | gemini | Google AI Studio | gemini-2.0-flash-exp | ⏳ Pendiente |
| 10 | cloudflare | Cloudflare Workers AI | llama-3.3-70b-instruct-fp8-fast | ⏳ Pendiente |
| 11 | huggingface | Hugging Face | Llama-3.3-70B-Instruct | ⏳ Pendiente |
| 12 | nebius | Nebius AI | Llama-3.3-70B-Instruct | ⏳ Pendiente |

**Configuración:**
- Rotación automática: 429/402/401 → siguiente proveedor
- Multi-key por proveedor
- Default pipeline: groq (limpiar) → openrouter (verificar) → gemini (corregir)
- Rate limiting: 30 req/min/IP en Edge Function

---

## 6. Análisis Multidisciplinario (35 Roles)

### 🏗️ Área Técnica

| Rol | Veredicto | Score | Acción Principal | Estado |
|-----|-----------|-------|------------------|--------|
| **Software Architect** | Arquitectura sólida, bajo acoplamiento | ⭐⭐⭐⭐ | Circuit breaker formal para proveedores IA | ⏳ |
| **Cloud Architect** | Hostinger compartido es cuello de botella | ⭐⭐⭐ | Cloudflare CDN (gratis) → futuro Vercel | 📚 Guía lista |
| **Backend Developer** | Edge Function robusta, rate limit in-memory | ⭐⭐⭐⭐ | Rate limit en DB, retry con backoff | ⏳ |
| **Frontend Developer** | Código limpio, shadcn/ui consistente | ⭐⭐⭐⭐ | Dividir useContactProcessing (407 líneas) | ⏳ |
| **iOS Developer** | PWA manifest + SW implementados | ⭐⭐⭐ | iOS standalone mode, push notifications | ⏳ |
| **Android Developer** | PWA funcional, install prompt pendiente | ⭐⭐⭐ | beforeinstallprompt handler | ⏳ |
| **DevOps Engineer** | CI/CD con rollback automático | ⭐⭐⭐⭐ | Staging environment, feature flags | ⏳ |
| **SRE** | Sin monitoreo real | ⭐⭐ | Sentry errores + uptime check | ⏳ |
| **Cybersecurity Architect** | CSP + JWT + input validation ✅ | ⭐⭐⭐⭐ | Cloudflare WAF, security audit externo | ⏳ |
| **Data Engineer** | IndexedDB local, sin persistencia server | ⭐⭐⭐ | Migración parcial a Supabase DB | ⏳ |
| **ML Engineer** | 12 proveedores IA, prompts hardcodeados | ⭐⭐⭐ | Embeddings para dedup semántica | ⏳ |
| **QA Automation** | 174 tests, sin E2E en CI | ⭐⭐⭐ | Playwright en GitHub Actions | ⏳ |
| **DBA** | IndexedDB v3 bien diseñada | ⭐⭐⭐ | Índices compuestos, TTL para snapshots | ⏳ |

### 📦 Área de Producto y Gestión

| Rol | Veredicto | Score | Acción Principal | Estado |
|-----|-----------|-------|------------------|--------|
| **Product Manager** | Feature-complete pero sin tracción | ⭐⭐⭐ | Landing page SEO + Product Hunt launch | ✅ Landing lista |
| **Product Owner** | Backlog bien priorizado | ⭐⭐⭐⭐ | User stories para v11 (monetización) | ⏳ |
| **Scrum Master** | Desarrollo en sprints implícitos | ⭐⭐⭐ | Kanban board público, retrospectives | ⏳ |
| **UX Researcher** | Sin datos de uso real | ⭐⭐ | Analytics + heatmap (Plausible/Umami) | ⏳ |
| **UX Designer** | Onboarding wizard ✅, modo simple ✅ | ⭐⭐⭐⭐ | A/B test wizard vs. tutorial | ⏳ |
| **UI Designer** | shadcn/ui consistente, dark mode ✅ | ⭐⭐⭐⭐ | Tema personalizado con marca MejoraOK | ⏳ |
| **UX Writer** | Copy en español, claro | ⭐⭐⭐⭐ | Microcopy audit, tooltips mejorados | ⏳ |
| **Localization Manager** | i18n ES/EN/PT ✅ | ⭐⭐⭐ | Traducciones completas + auto-detección | ⏳ |
| **Delivery Manager** | Deploy automático con rollback | ⭐⭐⭐⭐ | Feature flags para rollouts graduales | ⏳ |

### 📈 Área Comercial y de Crecimiento

| Rol | Veredicto | Score | Acción Principal | Estado |
|-----|-----------|-------|------------------|--------|
| **Growth Manager** | Sin funnel definido | ⭐⭐ | Activation funnel: visit → import → clean → export | ⏳ |
| **ASO Specialist** | N/A (web app) | — | PWA install prompt como alternativa | ⏳ |
| **Performance Marketing** | Sin presupuesto, sin ads | ⭐ | SEO orgánico como canal principal | ⏳ |
| **SEO Specialist** | OG tags + Schema.org ✅, sin backlinks | ⭐⭐⭐ | Blog con contenido de keywords objetivo | ⏳ |
| **Business Development** | Sin partnerships | ⭐⭐ | Integraciones con CRMs (HubSpot, Pipedrive) | ⏳ |
| **Account Manager** | Sin usuarios B2B | ⭐ | Plan Pro con soporte prioritario | ⏳ |
| **Content Manager** | Sin blog ni contenido | ⭐⭐ | 3 artículos SEO: "limpiar contactos", "deduplicar CSV" | ⏳ |
| **Community Manager** | Sin presencia social | ⭐ | Twitter/X + Product Hunt launch | ⏳ |

### ⚖️ Área de Operaciones, Legal y Análisis

| Rol | Veredicto | Score | Acción Principal | Estado |
|-----|-----------|-------|------------------|--------|
| **BI Analyst** | Analytics básico (localStorage) | ⭐⭐ | Migrar a Plausible/Umami (GDPR-safe) | ⏳ |
| **Data Scientist** | Sin datos de usuarios para analizar | ⭐ | Event tracking: funnel conversion rates | ⏳ |
| **Legal & Compliance** | Privacy + Terms ✅ | ⭐⭐⭐⭐ | Cookie consent si se usa analytics | ⏳ |
| **DPO** | GDPR compliant (datos en cliente) | ⭐⭐⭐⭐ | Data retention policy documentada | ⏳ |
| **Customer Success** | Sin canal de soporte | ⭐⭐ | FAQ + chat widget (Crisp/Tawk.to) | ⏳ |
| **Technical Support T1** | Sin base de conocimiento | ⭐⭐ | Help center con guías paso a paso | ⏳ |
| **Technical Support T2** | Sin ticketing | ⭐⭐ | Email de soporte + template responses | ⏳ |
| **Technical Support T3** | Devs directos | ⭐⭐⭐ | GitHub Issues como ticketing técnico | ✅ |
| **RevOps** | Sin revenue, sin pipeline | ⭐ | Definir pricing antes de monetizar | ⏳ |

---

## 7. Plan por Etapas

### ✅ Etapas Completadas (v1.0 → v10.0)

| Etapa | Descripción | Versión | Fecha |
|-------|------------|---------|-------|
| Core | Pipeline IA completo, dedup, exportación | v3.0 | 2026-04-22 |
| Security | CSP, JWT, input validation, ErrorBoundary | v6.0 | 2026-04-24 |
| UX | Onboarding wizard, modo simple, preview, skeletons | v7.0 | 2026-04-24 |
| Performance | PWA, Web Worker, CDN guide, rollback deploy | v8.0 | 2026-04-24 |
| Testing | E2E Playwright, coverage, a11y, performance budget | v9.0 | 2026-04-24 |
| Growth | Landing page, SEO, i18n, fine-tuning JSONL | v10.0 | 2026-04-24 |

### 📋 Etapa 11 — Verificación y Estabilización (SEMANA 1)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 11.1 | Verificar funcionalidad en producción | SRE, QA | 🔴 Crítica | ✅ Verificado 2026-04-25 |
| 11.2 | Test pipeline completo con CSV real | QA, Product Owner | 🔴 Crítica | ✅ 27 contactos, 12 dup |
| 11.3 | Test todos los proveedores IA con keys reales | Backend Dev | 🟡 Alta | ⏳ Necesita keys |
| 11.4 | Monitoreo: Sentry para errores de producción | SRE | 🟡 Alta | ⏳ |
| 11.5 | Uptime check (cron que verifique HTTP 200) | DevOps | 🟡 Alta | ⏳ |
| 11.6 | Cloudflare CDN + SSL | Cloud Architect | 🟢 Media | 📚 Guía lista |
| 11.7 | Fix bug: "Teléfono" en dropdown de mapeo | Frontend Dev | 🟡 Alta | ⏳ |
| 11.8 | Fix bug: Encoding UTF-8 en samples del mapper | Frontend Dev | 🟢 Media | ⏳ |
| 11.9 | Fix bug: Historial no se crea con reglas | Backend Dev | 🟢 Media | ⏳ |

### 📋 Etapa 12 — UX y Monetización (SEMANA 2)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 12.1 | Analytics: Plausible o Umami (GDPR-safe) | BI Analyst, DPO | 🟡 Alta | ⏳ |
| 12.2 | Funnel tracking: visit → import → clean → export | Growth Manager | 🟡 Alta | ⏳ |
| 12.3 | Pricing page: Free vs Pro | Product Manager | 🟡 Alta | ⏳ |
| 12.4 | Límites Free: 500 contacts/lote, 3 lotes/día | Backend Dev | 🟡 Alta | ⏳ |
| 12.5 | Plan Pro: ilimitado + prioridad en IA | Product Owner | 🟢 Media | ⏳ |
| 12.6 | Cookie consent banner | Legal, Frontend | 🟢 Media | ⏳ |

### 📋 Etapa 13 — Crecimiento (SEMANA 3)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 13.1 | Blog SEO: 3 artículos clave | Content Manager | 🟡 Alta | ⏳ |
| 13.2 | Product Hunt launch | Growth Manager | 🟡 Alta | ⏳ |
| 13.3 | Twitter/X presencia | Community Manager | 🟢 Media | ⏳ |
| 13.4 | FAQ + Help Center | Customer Success | 🟢 Media | ⏳ |
| 13.5 | Chat widget (Crisp o Tawk.to) | Technical Support T1 | 🟢 Media | ⏳ |

### 📋 Etapa 14 — Escalabilidad (SEMANA 4+)

| # | Tarea | Rol responsable | Prioridad | Estado |
|---|-------|----------------|-----------|--------|
| 14.1 | Circuit breaker formal para proveedores IA | Software Architect | 🟢 Media | ⏳ |
| 14.2 | Rate limit en Supabase DB (cross-instance) | Backend Dev | 🟢 Media | ⏳ |
| 14.3 | Embeddings para dedup semántica | ML Engineer | 🔵 Futuro | ⏳ |
| 14.4 | Migración parcial a Supabase DB | Data Engineer | 🔵 Futuro | ⏳ |
| 14.5 | Integraciones CRM (HubSpot, Pipedrive) | Business Dev | 🔵 Futuro | ⏳ |
| 14.6 | App nativa iOS/Android | Mobile Devs | 🔵 Futuro | ⏳ |

---

## 8. Infraestructura y Deploy

### Servicios

| Servicio | Detalle |
|----------|---------|
| Hosting frontend | Hostinger (FTP IP: 185.212.70.250, SSH puerto: 65002) |
| Usuario SSH | `u846064658` |
| Ruta base | `/home/u846064658/domains/mejoraok.com/public_html/util/mejoracontactos/` |
| Supabase project | `tzatuvxatsduuslxqdtm` |
| Supabase URL | `https://tzatuvxatsduuslxqdtm.supabase.co` |
| DNS | `util.mejoraok.com` → Hostinger |
| GitHub Secrets | `SSH_HOST`, `SSH_USER`, `SSH_PASS`, `SSH_PORT` |

### URLs de Producción

| URL | Descripción |
|-----|------------|
| https://util.mejoraok.com/ | Landing page de utilidades |
| https://util.mejoraok.com/mejoracontactos/ | **App principal** |
| https://mejoraok.com/util/mejoracontactos/ | Fallback (redirect) |

### Pipeline CI/CD

```yaml
Trigger: push to main
Steps:
  1. checkout
  2. setup-node 22
  3. npm ci --legacy-peer-deps
  4. npm audit (warn only)
  5. npm test (174 tests)
  6. npm run build
  7. Smoke test: dist/index.html exists
  8. SSH: backup current → clean assets/
  9. SCP: dist/* → Hostinger
  10. Post-deploy: curl HTTP 200 check
  11. On failure: auto-rollback from backup
```

### Deploy Edge Functions (manual)

```bash
npx supabase login --token sbp_XXXXX
npx supabase link --project-ref tzatuvxatsduuslxqdtm
npx supabase functions deploy clean-contacts
npx supabase functions deploy google-contacts-auth
```

---

## 9. Seguridad

### Controles Implementados

| Control | Estado | Detalle |
|---------|--------|---------|
| CSP headers | ✅ | Content-Security-Policy + 5 headers |
| JWT verification | ✅ | Edge Function verifica contra Supabase Auth |
| Input validation | ✅ | Max 10K contacts, field length limits |
| XSS protection | ✅ | React escapa por defecto + `escapeHtml()` en HTML |
| CORS | ✅ | Whitelist: util.mejoraok.com, mejoraok.com, localhost |
| Rate limiting | ✅ | 30 req/min/IP en Edge Function |
| API keys | ✅ | En localStorage del usuario, nunca en repo |
| ErrorBoundary | ✅ | React Error Boundary global |
| Privacy Policy | ✅ | /privacy — GDPR-compliant |
| Terms of Service | ✅ | /terms |
| .env protection | ✅ | En .gitignore |

### Pendientes

- ⏳ Sentry para errores de producción
- ⏳ Cloudflare WAF
- ⏳ Cookie consent banner
- ⏳ npm audit blocking en CI
- ⏳ Encriptar API keys en localStorage (Web Crypto API)

---

## 10. Registro de Cambios

| Versión | Fecha | Cambios principales |
|---------|-------|-------------------|
| v10.1 | 2026-04-28 | Documentación consolidada en MASTERPLAN.md único |
| v10.0 | 2026-04-24 | Landing page, SEO, i18n, fine-tuning JSONL |
| v9.0 | 2026-04-24 | E2E Playwright, coverage, a11y, perf budget |
| v8.0 | 2026-04-24 | PWA, Web Worker, CDN guide, rollback deploy |
| v7.0 | 2026-04-24 | Onboarding wizard, modo simple, preview, skeletons |
| v6.0 | 2026-04-24 | CSP headers, JWT, input validation, Privacy/Terms |
| v5.0 | 2026-04-24 | Health Check, Historial/Undo |
| v4.5 | 2026-04-24 | Limpieza proveedor "lovable" obsoleto |
| v4.4 | 2026-04-24 | Fix anon key + modelo OpenRouter |
| v4.3 | 2026-04-24 | Migración Supabase propio |
| v4.0 | 2026-04-23 | Hardening: Worker, lazy xlsx, a11y, rate limit |
| v3.0 | 2026-04-22 | Core completo: pipeline IA, dedup, exportación |

---

## 11. Archivos Clave

| Archivo | Qué hace | Líneas |
|---------|----------|--------|
| `src/hooks/useContactProcessing.ts` | Lógica central del pipeline | 407 |
| `src/lib/providers.ts` | Config de 12 proveedores IA | 29 |
| `src/lib/db.ts` | IndexedDB v3 | 228 |
| `src/lib/dedup.ts` | Deduplicación O(n) + Jaro-Winkler | 227 |
| `src/lib/rule-cleaner.ts` | Limpieza determinística | 166 |
| `src/lib/ai-validator.ts` | Validación IA con cache | 231 |
| `src/lib/column-mapper.ts` | Auto-detección de columnas | 45 |
| `src/components/ColumnMapper.tsx` | UI mapeo de columnas | 171 |
| `src/pages/Index.tsx` | Página principal (6 tabs) | 324 |
| `supabase/functions/clean-contacts/index.ts` | Edge Function: limpieza IA | — |
| `Documents/MASTERPLAN.md` | Este archivo (doc principal) | — |

---

## 12. Comandos Rápidos

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

## 13. Convenciones

- **Idioma:** UI en español, código en inglés
- **Documentación:** Todo en `Documents/` (este archivo es el master)
- **"documentar":** Actualiza este MASTERPLAN.md con el estado actual
- **Commits:** `tipo: descripción` (feat, fix, docs, chore, ci, perf)
- **Git config:** `MejoraContactos Bot <bot@mejoraok.com>`
- **Branch:** `main` (deploy automático)
- **NO commitear:** `.env`, tokens, API keys, `supabase/.temp`

---

*Documento maestro — consolidación de toda la documentación del proyecto. Actualizar al decir "documentar".*
