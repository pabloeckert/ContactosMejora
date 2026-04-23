import { openDB, type IDBPDatabase } from "idb";
import type { UnifiedContact } from "@/types/contact";

const DB_NAME = "mejoraapp";
const DB_VERSION = 2;
const CURSOR_BATCH_SIZE = 5000; // Process 5K records per batch

let dbInstance: IDBPDatabase | null = null;

async function getDB() {
  if (dbInstance) return dbInstance;
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (db.objectStoreNames.contains("contacts")) {
        db.deleteObjectStore("contacts");
      }
      const store = db.createObjectStore("contacts", { keyPath: "id" });
      store.createIndex("email", "email", { unique: false });
      store.createIndex("whatsapp", "whatsapp", { unique: false });
      store.createIndex("source", "source", { unique: false });
    },
  });
  return dbInstance;
}

export async function saveContacts(contacts: UnifiedContact[]) {
  const db = await getDB();
  const tx = db.transaction("contacts", "readwrite");
  for (const c of contacts) {
    await tx.store.put(c);
  }
  await tx.done;
}

/**
 * Batched cursor-based getAll — replaces the old db.getAll() that loaded
 * everything into memory at once. Processes CURSOR_BATCH_SIZE records
 * per iteration to keep memory flat for 50K+ datasets.
 */
export async function getAllContacts(): Promise<UnifiedContact[]> {
  const db = await getDB();
  const all: UnifiedContact[] = [];
  let cursor = await db.transaction("contacts").store.openCursor();

  while (cursor) {
    all.push(cursor.value as UnifiedContact);
    cursor = await cursor.continue();
  }

  return all;
}

/**
 * Stream contacts in batches via cursor — for operations that process
 * records without needing them all in memory at once.
 * Calls onBatch for each batch of CURSOR_BATCH_SIZE records.
 */
export async function streamContacts(
  onBatch: (batch: UnifiedContact[], isLast: boolean) => void | Promise<void>
): Promise<number> {
  const db = await getDB();
  const tx = db.transaction("contacts");
  let cursor = await tx.store.openCursor();
  let batch: UnifiedContact[] = [];
  let total = 0;

  while (cursor) {
    batch.push(cursor.value as UnifiedContact);
    total++;

    if (batch.length >= CURSOR_BATCH_SIZE) {
      await onBatch(batch, false);
      batch = [];
    }

    cursor = await cursor.continue();
  }

  // Final batch
  if (batch.length > 0) {
    await onBatch(batch, true);
  }

  return total;
}

/**
 * Count-only operation — lightweight, no data transfer.
 */
export async function getContactCount(): Promise<number> {
  const db = await getDB();
  return db.count("contacts");
}

export async function clearContacts() {
  const db = await getDB();
  await db.clear("contacts");
}

export async function deleteContact(id: string) {
  const db = await getDB();
  await db.delete("contacts", id);
}

export async function updateContact(contact: UnifiedContact) {
  const db = await getDB();
  await db.put("contacts", contact);
}

/**
 * Batch delete by IDs — single transaction for efficiency.
 */
export async function deleteContacts(ids: string[]) {
  const db = await getDB();
  const tx = db.transaction("contacts", "readwrite");
  for (const id of ids) {
    await tx.store.delete(id);
  }
  await tx.done;
}

/**
 * Batch update — single transaction for bulk operations.
 */
export async function updateContacts(contacts: UnifiedContact[]) {
  const db = await getDB();
  const tx = db.transaction("contacts", "readwrite");
  for (const c of contacts) {
    await tx.store.put(c);
  }
  await tx.done;
}
