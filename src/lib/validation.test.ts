import { describe, expect, it } from "vitest";
import { cleanText, isValidEmail, validateEnquiry } from "./validation";
import { formatPrice } from "./format";

describe("isValidEmail", () => {
  it.each(["a@b.co", "name.surname@example.com.np", "  x@y.org  "])("accepts %s", (e) => expect(isValidEmail(e)).toBe(true));
  it.each(["", "plain", "a@b", "a@b.c", "a b@c.com", 42, null])("rejects %s", (e) => expect(isValidEmail(e)).toBe(false));
});

describe("validateEnquiry", () => {
  const good = { kind: "contact", name: "Asha", email: "asha@example.com", message: "Do you resize rings?" };

  it("accepts a valid contact enquiry", () => {
    expect(validateEnquiry(good).ok).toBe(true);
  });

  it("reports each invalid field", () => {
    const r = validateEnquiry({ kind: "contact", name: "", email: "nope", phone: "abc", message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name", "phone"]);
  });

  it("requires items for purchase enquiries but not a message", () => {
    const r = validateEnquiry({ ...good, kind: "purchase", message: "", items: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.items).toBeDefined();
    expect(validateEnquiry({ ...good, kind: "purchase", message: "", items: [{ productId: "p-pear", quantity: 1 }] }).ok).toBe(true);
  });

  it("clamps item quantities and caps lengths", () => {
    const r = validateEnquiry({ ...good, kind: "purchase", name: "A".repeat(500), items: [{ productId: "p-pear", quantity: 999 }] });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toHaveLength(120);
      expect(r.value.items[0].quantity).toBe(10);
    }
  });

  it("strips control characters", () => {
    expect(cleanText("he\u0000llo\u0007 ", 20)).toBe("hello");
  });
});

describe("formatPrice", () => {
  it("uses lakh grouping and the rupee symbol", () => {
    // Intl separates the symbol with a non-breaking space
    const plain = (n: number) => formatPrice(n).replace(/\s/g, " ");
    expect(plain(485000)).toBe("Rs 4,85,000");
    expect(plain(98000)).toBe("Rs 98,000");
  });
});
