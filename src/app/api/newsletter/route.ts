import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";

/**
 * Newsletter sign-up.
 *
 * Integration point: set NEWSLETTER_WEBHOOK_URL (server-only) to any endpoint that accepts
 * `POST { email, source }` as JSON — a mailing-list provider's API proxy, Zapier/Make hook, etc.
 * Without it the route reports `not_configured` and nothing is stored.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ status: "invalid", message: "Enter an email address in the format name@example.com." }, { status: 400 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ status: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "sumix-website" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Provider responded ${res.status}`);
    return NextResponse.json({ status: "subscribed" });
  } catch (error) {
    console.error("[newsletter] forwarding failed", error);
    return NextResponse.json({ status: "error" }, { status: 502 });
  }
}
