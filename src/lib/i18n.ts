/**
 * Lightweight i18n — no external dependencies.
 * Uses a simple key-value approach with locale detection.
 *
 * To add a new language:
 * 1. Add translations to the TRANSLATIONS object
 * 2. The app auto-detects from navigator.language
 */

type Locale = "es" | "en" | "pt";

const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  es: {
    // Header
    "app.name": "MejoraContactos",
    "app.tagline": "AI Pro",

    // Tabs
    "tab.import": "Importar",
    "tab.process": "Procesar",
    "tab.results": "Resultados",
    "tab.export": "Exportar",
    "tab.dashboard": "Dashboard",
    "tab.settings": "Config",

    // Import
    "import.dropzone": "Arrastrá archivos o carpetas aquí",
    "import.dropzone.sub": "o hacé click para seleccionar",
    "import.formats": "CSV, Excel, VCF, JSON",
    "import.google": "Importar desde Google Contacts",

    // Process
    "process.noFiles": "Cargá archivos primero en la pestaña Importar",
    "process.start": "Procesar Contactos",
    "process.pause": "Pausar",
    "process.stop": "Detener",

    // Results
    "results.empty": "Sin resultados todavía",
    "results.empty.desc": "Procesá tus archivos para ver los contactos limpios y deduplicados acá.",

    // Export
    "export.empty": "Nada para exportar",
    "export.empty.desc": "Procesá tus contactos primero. Después podés exportarlos en CSV, Excel, VCF, JSON, JSONL o HTML.",

    // Dashboard
    "dashboard.empty": "Dashboard vacío",
    "dashboard.empty.desc": "Cuando procesés tus contactos, acá vas a ver métricas de calidad.",

    // Settings
    "settings.apiKeys": "Administrador de API Keys",
    "settings.healthCheck": "Health Check",
    "settings.history": "Historial",

    // Onboarding
    "onboarding.step1.title": "Importá tus contactos",
    "onboarding.step1.desc": "Subí archivos CSV, Excel, VCF o JSON. También podés conectar tu cuenta de Google Contacts.",
    "onboarding.step2.title": "La IA limpia por vos",
    "onboarding.step2.desc": "Nuestro pipeline normaliza nombres, teléfonos y emails. Deduplica contactos repetidos.",
    "onboarding.step3.title": "Exportá limpio",
    "onboarding.step3.desc": "Descargá tus contactos limpios en CSV, Excel, VCF, JSON o JSONL.",
    "onboarding.next": "Siguiente",
    "onboarding.back": "Atrás",
    "onboarding.skip": "Saltar",
    "onboarding.start": "¡Empezar!",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.delete": "Eliminar",
    "common.close": "Cerrar",

    // Footer
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
  },

  en: {
    "app.name": "MejoraContactos",
    "app.tagline": "AI Pro",
    "tab.import": "Import",
    "tab.process": "Process",
    "tab.results": "Results",
    "tab.export": "Export",
    "tab.dashboard": "Dashboard",
    "tab.settings": "Settings",
    "import.dropzone": "Drag files or folders here",
    "import.dropzone.sub": "or click to select",
    "import.formats": "CSV, Excel, VCF, JSON",
    "import.google": "Import from Google Contacts",
    "process.noFiles": "Upload files first in the Import tab",
    "process.start": "Process Contacts",
    "results.empty": "No results yet",
    "results.empty.desc": "Process your files to see cleaned and deduplicated contacts here.",
    "export.empty": "Nothing to export",
    "export.empty.desc": "Process your contacts first. Then export them in CSV, Excel, VCF, JSON, JSONL or HTML.",
    "dashboard.empty": "Empty dashboard",
    "dashboard.empty.desc": "When you process your contacts, you'll see quality metrics here.",
    "onboarding.step1.title": "Import your contacts",
    "onboarding.step1.desc": "Upload CSV, Excel, VCF or JSON files. Or connect your Google Contacts account.",
    "onboarding.step2.title": "AI cleans for you",
    "onboarding.step2.desc": "Our pipeline normalizes names, phones and emails. Deduplicates contacts automatically.",
    "onboarding.step3.title": "Export clean data",
    "onboarding.step3.desc": "Download your clean contacts in CSV, Excel, VCF, JSON or JSONL.",
    "onboarding.next": "Next",
    "onboarding.skip": "Skip",
    "onboarding.start": "Get Started!",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
  },

  pt: {
    "app.name": "MejoraContactos",
    "app.tagline": "AI Pro",
    "tab.import": "Importar",
    "tab.process": "Processar",
    "tab.results": "Resultados",
    "tab.export": "Exportar",
    "tab.dashboard": "Dashboard",
    "tab.settings": "Config",
    "import.dropzone": "Arraste arquivos ou pastas aqui",
    "import.dropzone.sub": "ou clique para selecionar",
    "process.noFiles": "Carregue arquivos primeiro na aba Importar",
    "process.start": "Processar Contatos",
    "results.empty": "Sem resultados ainda",
    "export.empty": "Nada para exportar",
    "onboarding.step1.title": "Importe seus contatos",
    "onboarding.step1.desc": "Envie arquivos CSV, Excel, VCF ou JSON. Ou conecte sua conta do Google Contacts.",
    "onboarding.step2.title": "A IA limpa por você",
    "onboarding.step2.desc": "Nosso pipeline normaliza nomes, telefones e emails. Deduplica contatos automaticamente.",
    "onboarding.step3.title": "Exporte limpo",
    "onboarding.step3.desc": "Baixe seus contatos limpos em CSV, Excel, VCF, JSON ou JSONL.",
    "onboarding.next": "Próximo",
    "onboarding.skip": "Pular",
    "onboarding.start": "Começar!",
    "footer.privacy": "Privacidade",
    "footer.terms": "Termos",
  },
};

function detectLocale(): Locale {
  const stored = localStorage.getItem("__mc_locale__");
  if (stored && stored in TRANSLATIONS) return stored as Locale;

  const browserLang = navigator.language?.slice(0, 2)?.toLowerCase();
  if (browserLang in TRANSLATIONS) return browserLang as Locale;

  return "es"; // Default
}

let currentLocale: Locale = detectLocale();

export function t(key: string): string {
  return TRANSLATIONS[currentLocale]?.[key] || TRANSLATIONS.es[key] || key;
}

export function setLocale(locale: Locale) {
  currentLocale = locale;
  localStorage.setItem("__mc_locale__", locale);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function getAvailableLocales(): { code: Locale; name: string }[] {
  return [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "pt", name: "Português" },
  ];
}
