/**
 * Simple feature flags system.
 * Uses localStorage for user overrides + env vars for global defaults.
 */

interface FeatureFlags {
  [key: string]: boolean;
}

const FLAG_STORAGE = "__mc_feature_flags__";

// Default flags — set to true to enable features by default
const DEFAULT_FLAGS: FeatureFlags = {
  analytics: false,
  betaMode: false,
  advancedExport: true,
};

function loadFlags(): FeatureFlags {
  try {
    const stored = localStorage.getItem(FLAG_STORAGE);
    if (stored) return { ...DEFAULT_FLAGS, ...JSON.parse(stored) };
  } catch { /* localStorage unavailable */ }
  return { ...DEFAULT_FLAGS };
}

let flags = loadFlags();

export function isEnabled(flag: string): boolean {
  return flags[flag] ?? false;
}

export function setFlag(flag: string, value: boolean): void {
  flags[flag] = value;
  try {
    localStorage.setItem(FLAG_STORAGE, JSON.stringify(flags));
  } catch { /* localStorage unavailable */ }
}

export function getAllFlags(): FeatureFlags {
  return { ...flags };
}

export function resetFlags(): void {
  flags = { ...DEFAULT_FLAGS };
  localStorage.removeItem(FLAG_STORAGE);
}
