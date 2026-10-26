// Shared by client forms and route handlers so both sides agree on what is valid.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 && EMAIL.test(value.trim());
}

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

export interface EnquiryInput {
  kind: "contact" | "purchase";
  name: string;
  email: string;
  phone: string;
  message: string;
  items: { productId: string; variantId: string | null; quantity: number }[];
}

export type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message" | "items", string>>;

export function validateEnquiry(raw: unknown): { ok: true; value: EnquiryInput } | { ok: false; errors: FieldErrors } {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const kind = body.kind === "purchase" ? "purchase" : "contact";
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254);
  const phone = cleanText(body.phone, 40);
  const message = cleanText(body.message, 4000);
  const items = Array.isArray(body.items)
    ? body.items
        .slice(0, 20)
        .map((i) => i as Record<string, unknown>)
        .filter((i) => typeof i.productId === "string")
        .map((i) => ({
          productId: String(i.productId).slice(0, 64),
          variantId: typeof i.variantId === "string" ? i.variantId.slice(0, 64) : null,
          quantity: Math.min(Math.max(1, Math.floor(Number(i.quantity) || 1)), 10),
        }))
    : [];

  const errors: FieldErrors = {};
  if (name.length < 2) errors.name = "Enter your name.";
  if (!isValidEmail(email)) errors.email = "Enter an email address in the format name@example.com.";
  if (phone && !/^[+()\d\s-]{6,}$/.test(phone)) errors.phone = "Enter a phone number using digits, spaces or +.";
  if (kind === "contact" && message.length < 10) errors.message = "Tell us a little more, at least a sentence.";
  if (kind === "purchase" && items.length === 0) errors.items = "Your bag is empty.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { kind, name, email, phone, message, items } };
}
