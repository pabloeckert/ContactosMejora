/**
 * Lightweight analytics — no external dependencies.
 * Stores events in localStorage. Can be upgraded to Umami/Plausible later.
 *
 * To enable Umami:
 * 1. Add <script defer data-website-id="YOUR_ID" src="https://analytics.example.com/umami.js"></script> to index.html
 * 2. Events will auto-track via umami.track()
 */

interface AnalyticsEvent {
  name: string;
  props?: Record<string, string | number>;
  timestamp: number;
}

const STORAGE_KEY = "__mc_analytics__";
const MAX_EVENTS = 200;

function getEvents(): AnalyticsEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEvents(events: AnalyticsEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // localStorage full — clear old events
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-50)));
  }
}

export function trackEvent(name: string, props?: Record<string, string | number>) {
  const event: AnalyticsEvent = { name, props, timestamp: Date.now() };
  const events = getEvents();
  events.push(event);
  saveEvents(events);

  // Console log in dev mode
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${name}`, props || "");
  }

  // Future: umami.track(name, props);
}

// Convenience tracking functions
export const analytics = {
  // Onboarding
  wizardStarted: () => trackEvent("wizard_started"),
  wizardStep: (step: number) => trackEvent("wizard_step", { step }),
  wizardCompleted: () => trackEvent("wizard_completed"),
  wizardSkipped: () => trackEvent("wizard_skipped"),

  // Import
  fileImported: (format: string, rows: number) => trackEvent("file_imported", { format, rows }),
  googleContactsImported: (count: number) => trackEvent("google_contacts_imported", { count }),

  // Processing
  processingStarted: (provider: string, contactCount: number) =>
    trackEvent("processing_started", { provider, contactCount }),
  processingCompleted: (provider: string, durationMs: number, cleaned: number, duplicates: number) =>
    trackEvent("processing_completed", { provider, durationMs, cleaned, duplicates }),
  processingFailed: (provider: string, error: string) =>
    trackEvent("processing_failed", { provider, error: error.slice(0, 100) }),

  // Export
  exportCompleted: (format: string, count: number) => trackEvent("export_completed", { format, count }),

  // Settings
  apiKeyAdded: (provider: string) => trackEvent("api_key_added", { provider }),
  healthCheckRun: (providerCount: number) => trackEvent("health_check_run", { providerCount }),

  // Undo
  undoPerformed: (snapshotAge: string) => trackEvent("undo_performed", { snapshotAge }),

  // Mode
  simpleModeToggled: (enabled: boolean) => trackEvent("simple_mode_toggled", { enabled: enabled ? 1 : 0 }),

  // Get stats for display
  getStats: () => {
    const events = getEvents();
    return {
      totalEvents: events.length,
      firstSeen: events[0]?.timestamp || null,
      lastSeen: events[events.length - 1]?.timestamp || null,
      eventCounts: events.reduce((acc, e) => {
        acc[e.name] = (acc[e.name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
};
