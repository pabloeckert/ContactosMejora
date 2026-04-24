/**
 * Fine-tuning pipeline utilities.
 * Generates JSONL training data from cleaned contacts for AI model fine-tuning.
 *
 * Output format: OpenAI-compatible JSONL
 * Each line: {"messages": [{"role": "system", ...}, {"role": "user", ...}, {"role": "assistant", ...}]}
 */

import type { UnifiedContact } from "@/types/contact";

interface TrainingExample {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
}

const SYSTEM_PROMPT = `You are a contact data cleaner. Given raw contact data, return a clean, normalized version.
Rules:
- Names: Title Case, split first/last if combined
- Phone: E.164 format (e.g., +5491155551234)
- Email: lowercase, validated format
- Company: Title Case, remove junk (N/A, -, .)
- Job Title: Title Case, remove junk
- Empty fields: use empty string ""`;

function buildUserPrompt(contact: Partial<UnifiedContact>): string {
  return `Clean this contact:
firstName: "${contact.firstName || ""}"
lastName: "${contact.lastName || ""}"
phone: "${contact.whatsapp || ""}"
email: "${contact.email || ""}"
company: "${contact.company || ""}"
jobTitle: "${contact.jobTitle || ""}"`;
}

function buildAssistantPrompt(contact: UnifiedContact): string {
  return JSON.stringify({
    firstName: contact.firstName || "",
    lastName: contact.lastName || "",
    phone: contact.whatsapp || "",
    email: contact.email || "",
    company: contact.company || "",
    jobTitle: contact.jobTitle || "",
  });
}

/**
 * Generate training examples from cleaned contacts.
 * Creates input/output pairs where:
 * - Input: raw contact data (before cleaning)
 * - Output: cleaned contact data (after cleaning)
 *
 * For best results, use contacts that were actually cleaned by AI (aiCleaned: true).
 */
export function generateTrainingData(contacts: UnifiedContact[]): TrainingExample[] {
  return contacts
    .filter((c) => c.aiCleaned) // Only contacts that were actually cleaned by AI
    .map((contact) => ({
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        { role: "user" as const, content: buildUserPrompt(contact) },
        { role: "assistant" as const, content: buildAssistantPrompt(contact) },
      ],
    }));
}

/**
 * Export training data as JSONL string.
 * Each line is a valid JSON object ready for OpenAI/HuggingFace fine-tuning.
 */
export function exportAsJSONL(contacts: UnifiedContact[]): string {
  const examples = generateTrainingData(contacts);
  return examples.map((ex) => JSON.stringify(ex)).join("\n");
}

/**
 * Download JSONL file.
 */
export function downloadJSONL(contacts: UnifiedContact[], filename = "training-data.jsonl") {
  const jsonl = exportAsJSONL(contacts);
  const blob = new Blob([jsonl], { type: "application/jsonl" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Get stats about the training data.
 */
export function getTrainingStats(contacts: UnifiedContact[]): {
  total: number;
  aiCleaned: number;
  trainingExamples: number;
  estimatedTokens: number;
} {
  const aiCleaned = contacts.filter((c) => c.aiCleaned).length;
  const examples = generateTrainingData(contacts);
  const estimatedTokens = examples.reduce((sum, ex) => {
    return sum + ex.messages.reduce((s, m) => s + m.content.length / 4, 0); // ~4 chars per token
  }, 0);

  return {
    total: contacts.length,
    aiCleaned,
    trainingExamples: examples.length,
    estimatedTokens: Math.round(estimatedTokens),
  };
}
