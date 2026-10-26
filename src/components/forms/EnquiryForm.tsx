"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { getProductById } from "@/lib/catalog";
import { cartSubtotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart, useStoresHydrated } from "@/lib/stores";
import { validateEnquiry, type FieldErrors } from "@/lib/validation";
import { ArrowLink, Button, cn } from "@/components/ui/primitives";

type Status = "idle" | "sending" | "received" | "not-configured" | "error";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.9375rem] font-medium">
        {label}
        {optional && <span className="text-caption font-normal text-taupe">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-caption text-error">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "mt-2 w-full border-b bg-transparent py-3 outline-none transition-colors duration-200 placeholder:text-taupe/60 focus:border-obsidian",
    invalid ? "border-error" : "border-obsidian/30",
  );

/**
 * Contact form and enquiry-based checkout. Posts to /api/enquiry, which forwards to
 * ENQUIRY_WEBHOOK_URL when configured. When it is not, the visitor is told the truth.
 */
export function EnquiryForm({ kind }: { kind: "contact" | "purchase" }) {
  const id = useId();
  const hydrated = useStoresHydrated();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clear);
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const items = lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity }));
  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { kind, ...values, items: kind === "purchase" ? items : [] };
    const check = validateEnquiry(payload);
    if (!check.ok) {
      setErrors(check.errors);
      const first = Object.keys(check.errors)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; errors?: FieldErrors };
      if (res.ok && data.status === "received") {
        setStatus("received");
        if (kind === "purchase") clearCart();
      } else if (data.status === "not_configured") {
        setStatus("not-configured");
      } else if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (kind === "purchase" && !hydrated) {
    return <div className="min-h-[24rem]" aria-busy="true" aria-label="Loading your bag" />;
  }

  if (kind === "purchase" && lines.length === 0 && status !== "received") {
    return (
      <div className="max-w-lg py-6">
        <p className="display-sm">Your bag is empty.</p>
        <p className="mt-3 text-taupe">Add a piece to your bag, then return here to send your order enquiry.</p>
        <ArrowLink href="/shop" className="mt-8">
          Explore the collection
        </ArrowLink>
      </div>
    );
  }

  if (status === "received") {
    return (
      <div role="status" className="max-w-lg py-6">
        <p className="display-sm">{kind === "purchase" ? "Your order enquiry has been sent." : "Your enquiry has been sent."}</p>
        <p className="mt-3 text-taupe">We have your details and will reply by email.</p>
        <ArrowLink href="/shop" className="mt-8">
          Continue browsing
        </ArrowLink>
      </div>
    );
  }

  const subtotal = cartSubtotal(lines, getProductById);

  return (
    <div className={cn("grid gap-14", kind === "purchase" && "lg:grid-cols-12 lg:gap-10")}>
      <form onSubmit={submit} noValidate className={cn("space-y-8", kind === "purchase" ? "lg:col-span-6" : "max-w-xl")}>
        <Field id={`${id}-name`} label="Name" error={errors.name}>
          <input
            id={`${id}-name`}
            value={values.name}
            onChange={set("name")}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id}-name-error` : undefined}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field id={`${id}-email`} label="Email" error={errors.email}>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id}-email-error` : undefined}
            className={inputClass(!!errors.email)}
          />
        </Field>
        <Field id={`${id}-phone`} label="Phone" error={errors.phone} optional>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            className={inputClass(!!errors.phone)}
          />
        </Field>
        <Field
          id={`${id}-message`}
          label={kind === "purchase" ? "Notes for your order" : "How can we help?"}
          error={errors.message}
          optional={kind === "purchase"}
        >
          <textarea
            id={`${id}-message`}
            rows={5}
            value={values.message}
            onChange={set("message")}
            placeholder={kind === "purchase" ? "Gift message, preferred delivery dates, sizing questions…" : "Tell us about the piece or occasion you have in mind."}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id}-message-error` : undefined}
            className={cn(inputClass(!!errors.message), "resize-y")}
          />
        </Field>

        {errors.items && <p className="text-caption text-error">{errors.items}</p>}

        <div className="space-y-4">
          <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
            {status === "sending" ? "Sending" : kind === "purchase" ? "Send order enquiry" : "Send enquiry"}
          </Button>
          <div aria-live="polite" className="text-caption">
            {status === "not-configured" && (
              <p className="border-l border-champagne pl-4 text-taupe">
                Online enquiries aren&apos;t connected yet, so nothing was sent and your details were not stored.
                {kind === "purchase" && " Your bag is still saved on this device."}
              </p>
            )}
            {status === "error" && (
              <p className="text-error">The enquiry service didn&apos;t respond. Check your connection and try again.</p>
            )}
          </div>
          <p className="text-caption text-taupe">
            {kind === "purchase"
              ? "No payment is taken here. We confirm availability, delivery and payment with you directly."
              : "We use your details only to reply to this enquiry."}
          </p>
        </div>
      </form>

      {kind === "purchase" && (
        <aside aria-labelledby="order-summary" className="lg:col-span-5 lg:col-start-8">
          <div className="bg-parchment p-6 md:p-8">
            <h2 id="order-summary" className="font-display text-2xl">
              Your order
            </h2>
            <ul className="mt-6 divide-y divide-line">
              {lines.map((l) => {
                const p = getProductById(l.productId);
                if (!p) return null;
                const v = p.variants?.options.find((o) => o.id === l.variantId);
                return (
                  <li key={l.key} className="flex gap-4 py-4">
                    <span className="relative block aspect-[4/5] w-16 shrink-0 bg-stone">
                      <Image src={p.images[0].src} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="flex-1 text-[0.9375rem]">
                      <span className="block font-display text-lg leading-snug">{p.name}</span>
                      <span className="block text-caption text-taupe">
                        {v ? `${v.label}, ` : ""}quantity {l.quantity}
                      </span>
                    </span>
                    <span className="text-[0.9375rem] tabular-nums">{formatPrice(p.price * l.quantity)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-line-strong pt-5">
              <span>Subtotal</span>
              <span className="font-display text-2xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-caption text-taupe">Delivery and any taxes are confirmed with you before payment.</p>
            <Link href="/cart" className="link-line mt-6 inline-block text-caption">
              Edit bag
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
