import { describe, it, expect } from "vitest";
import { DedupIndex, checkDuplicate } from "@/lib/dedup";

describe("DedupIndex", () => {
  it("should detect exact email duplicates", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "juan@gmail.com", whatsapp: "" });
    const result = index.add({ id: "2", firstName: "Juan", lastName: "García", email: "juan@gmail.com", whatsapp: "" });
    expect(result.isDuplicate).toBe(true);
    expect(result.duplicateOf).toBe("1");
    expect(result.confidence).toBe(100);
  });

  it("should detect email case-insensitive", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "Juan@Gmail.COM", whatsapp: "" });
    const result = index.add({ id: "2", firstName: "Pedro", lastName: "López", email: "juan@gmail.com", whatsapp: "" });
    expect(result.isDuplicate).toBe(true);
  });

  it("should detect phone duplicates by last 7 digits", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "", whatsapp: "+5491155551234" });
    const result = index.add({ id: "2", firstName: "Juan", lastName: "García", email: "", whatsapp: "+54 9 11 5555-1234" });
    expect(result.isDuplicate).toBe(true);
    expect(result.confidence).toBe(95);
  });

  it("should not detect duplicate for different phones and names", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "", whatsapp: "+5491155551234" });
    const result = index.add({ id: "2", firstName: "Pedro", lastName: "Martínez", email: "", whatsapp: "+5491155559999" });
    expect(result.isDuplicate).toBe(false);
  });

  it("should detect fuzzy name duplicates", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "", whatsapp: "" });
    const result = index.add({ id: "2", firstName: "Juan", lastName: "García", email: "", whatsapp: "" });
    expect(result.isDuplicate).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(88);
  });

  it("should not detect duplicate for different names", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "Juan", lastName: "García", email: "", whatsapp: "" });
    const result = index.add({ id: "2", firstName: "María", lastName: "López", email: "", whatsapp: "" });
    expect(result.isDuplicate).toBe(false);
  });

  it("should handle empty contacts", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "", lastName: "", email: "", whatsapp: "" });
    const result = index.add({ id: "2", firstName: "", lastName: "", email: "", whatsapp: "" });
    expect(result.isDuplicate).toBe(false);
  });

  it("should track size correctly", () => {
    const index = new DedupIndex();
    expect(index.size).toBe(0);
    index.add({ id: "1", firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" });
    expect(index.size).toBe(1);
    index.add({ id: "2", firstName: "C", lastName: "D", email: "c@d.com", whatsapp: "" });
    expect(index.size).toBe(2);
  });

  it("should not count duplicates in size", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" });
    index.add({ id: "2", firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" });
    expect(index.size).toBe(1);
  });

  it("should clear all indexes", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" });
    index.clear();
    expect(index.size).toBe(0);
    const result = index.add({ id: "2", firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" });
    expect(result.isDuplicate).toBe(false);
  });

  it("should handle phone with less than 7 digits", () => {
    const index = new DedupIndex();
    index.add({ id: "1", firstName: "A", lastName: "B", email: "", whatsapp: "12345" });
    const result = index.add({ id: "2", firstName: "A", lastName: "B", email: "", whatsapp: "12345" });
    // Phones with < 7 digits are not indexed, so no phone duplicate
    expect(result.isDuplicate).toBe(false);
  });
});

describe("checkDuplicate (legacy)", () => {
  it("should detect email match", () => {
    const existing = [{ id: "1", firstName: "A", lastName: "B", email: "test@test.com", whatsapp: "" }];
    const result = checkDuplicate({ firstName: "X", lastName: "Y", email: "test@test.com", whatsapp: "" }, existing);
    expect(result.isDuplicate).toBe(true);
    expect(result.confidence).toBe(100);
  });

  it("should detect phone match", () => {
    const existing = [{ id: "1", firstName: "A", lastName: "B", email: "", whatsapp: "+5491155551234" }];
    const result = checkDuplicate({ firstName: "X", lastName: "Y", email: "", whatsapp: "+5491155551234" }, existing);
    expect(result.isDuplicate).toBe(true);
  });

  it("should return false for empty existing", () => {
    const result = checkDuplicate({ firstName: "A", lastName: "B", email: "a@b.com", whatsapp: "" }, []);
    expect(result.isDuplicate).toBe(false);
  });
});
