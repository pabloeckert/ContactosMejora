/**
 * Rule-based cleaner for obvious fixes — no AI needed.
 * Handles 80%+ of cleaning for high-volume data.
 */

// Capitalize first letter of each word
function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(?:^|\s|[-'])\S/g, (c) => c.toUpperCase())
    .trim();
}

// Remove common junk values
const JUNK = new Set([
  "n/a", "na", "n.a.", "none", "null", "undefined", "-", "--", "---",
  ".", "..", "...", "xxx", "xxxx", "test", "prueba", "aaa", "asdf",
  "sin dato", "sin datos", "no tiene", "no aplica", "desconocido",
]);

function cleanJunk(val: string): string {
  const lower = val.toLowerCase().trim();
  if (JUNK.has(lower) || lower.length < 2) return "";
  return val.trim();
}

// Clean email
function cleanEmail(email: string): string {
  const cleaned = email.toLowerCase().trim().replace(/\s+/g, "");
  // Basic validation
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) return cleaned;
  return "";
}

// Clean phone: remove non-digit chars (keep +), normalize Argentine numbers
function cleanPhone(phone: string): string {
  let cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned || cleaned.replace(/\D/g, "").length < 6) return "";

  // If starts with 15 and is 10 digits, assume Argentine mobile
  if (/^15\d{8}$/.test(cleaned)) {
    cleaned = "+549" + cleaned.slice(2);
  }
  // If no + prefix, try to add country code
  if (!cleaned.startsWith("+")) {
    // 10 digits starting with area code → Argentine
    if (/^\d{10}$/.test(cleaned)) {
      cleaned = "+54" + cleaned;
    }
    // 11 digits starting with 0 → strip 0, add +54
    else if (/^0\d{10}$/.test(cleaned)) {
      cleaned = "+54" + cleaned.slice(1);
    }
    // 13 digits starting with 54 → add +
    else if (/^54\d{10,11}$/.test(cleaned)) {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
}

export interface CleanResult {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  company: string;
  jobTitle: string;
  rulesCleaned: boolean;
  needsAI: boolean;
}

export function ruleClean(contact: {
  firstName?: string;
  lastName?: string;
  email?: string;
  whatsapp?: string;
  company?: string;
  jobTitle?: string;
}): CleanResult {
  const firstName = cleanJunk(contact.firstName || "");
  const lastName = cleanJunk(contact.lastName || "");
  const email = cleanEmail(contact.email || "");
  const phone = cleanPhone(contact.whatsapp || "");
  const company = cleanJunk(contact.company || "");
  const jobTitle = cleanJunk(contact.jobTitle || "");

  // Detect if AI is needed (ambiguous cases)
  let needsAI = false;

  // Name has numbers or weird chars → AI should handle
  if (/\d/.test(firstName + lastName)) needsAI = true;
  // Full name in one field (has space)
  if (firstName.includes(" ") && !lastName) needsAI = true;
  // Phone format unclear after rules
  if (contact.whatsapp && !phone) needsAI = true;
  // Company looks like a person name or vice versa
  if (company && /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(company)) needsAI = true;

  return {
    firstName: firstName ? titleCase(firstName) : "",
    lastName: lastName ? titleCase(lastName) : "",
    email,
    whatsapp: phone,
    company: company ? titleCase(company) : "",
    jobTitle: jobTitle ? titleCase(jobTitle) : "",
    rulesCleaned: true,
    needsAI,
  };
}

/**
 * Batch rule-clean contacts. Returns cleaned contacts and indices that need AI.
 */
export function batchRuleClean(
  contacts: Partial<{ firstName: string; lastName: string; email: string; whatsapp: string; company: string; jobTitle: string }>[]
): { cleaned: CleanResult[]; aiIndices: number[] } {
  const cleaned: CleanResult[] = [];
  const aiIndices: number[] = [];

  for (let i = 0; i < contacts.length; i++) {
    const result = ruleClean(contacts[i]);
    cleaned.push(result);
    if (result.needsAI) aiIndices.push(i);
  }

  return { cleaned, aiIndices };
}
