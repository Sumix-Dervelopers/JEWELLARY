import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { getProductById } from "@/lib/catalog";
import { validateEnquiry } from "@/lib/validation";

/**
 * Contact enquiries and purchase requests (the checkout is enquiry-based; no payment is taken).
 *
 * Integration point: set ENQUIRY_WEBHOOK_URL (server-only) to an endpoint that accepts the JSON
 * payload below — a CRM, help desk, email-sending function or automation hook. Without it the
 * route reports `not_configured` and nothing is sent or stored.
 */
export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const result = validateEnquiry(raw);
  if (!result.ok) {
    return NextResponse.json({ status: "invalid", errors: result.errors }, { status: 400 });
  }

  const enquiry = result.value;

  // Prices are recomputed on the server from the catalogue; client-sent totals are never trusted.
  const lines = enquiry.items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const variant = product.variants?.options.find((o) => o.id === item.variantId);
      return {
        product: product.name,
        slug: product.slug,
        variant: variant?.label ?? null,
        quantity: Math.min(item.quantity, product.maxQuantity),
        unitPrice: product.price,
      };
    })
    .filter((l) => l !== null);

  if (enquiry.kind === "purchase" && lines.length === 0) {
    return NextResponse.json({ status: "invalid", errors: { items: "These pieces are no longer available." } }, { status: 400 });
  }

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ status: "not_configured" }, { status: 503 });
  }

  const payload = {
    kind: enquiry.kind,
    receivedAt: new Date().toISOString(),
    customer: { name: enquiry.name, email: enquiry.email, phone: enquiry.phone || null },
    message: enquiry.message || null,
    lines,
    subtotal: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    currency: site.currency.code,
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("[enquiry] forwarding failed", error);
    return NextResponse.json({ status: "error" }, { status: 502 });
  }
}
