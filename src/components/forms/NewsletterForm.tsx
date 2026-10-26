"use client";

import { useId, useState } from "react";
import { cn, HairlineArrow } from "@/components/ui/primitives";
import { isValidEmail } from "@/lib/validation";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "invalid"; message: string }
  | { kind: "subscribed" }
  | { kind: "not-configured" }
  | { kind: "error"; message: string };

/**
 * Posts to /api/newsletter. Until a mailing provider is connected (NEWSLETTER_WEBHOOK_URL), the
 * route answers "not configured" and this form says so plainly instead of pretending to subscribe.
 */
export function NewsletterForm({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const onDark = tone === "dark";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus({ kind: "invalid", message: "Enter an email address in the format name@example.com." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string };
      if (res.ok && data.status === "subscribed") {
        setStatus({ kind: "subscribed" });
        setEmail("");
      } else if (data.status === "not_configured") {
        setStatus({ kind: "not-configured" });
      } else if (res.status === 400) {
        setStatus({ kind: "invalid", message: data.message ?? "Check the email address and try again." });
      } else {
        setStatus({ kind: "error", message: "The sign-up service didn't respond. Try again in a moment." });
      }
    } catch {
      setStatus({ kind: "error", message: "You appear to be offline. Check your connection and try again." });
    }
  }

  const describedBy = status.kind === "invalid" || status.kind === "error" ? `${id}-msg` : undefined;

  return (
    <form onSubmit={submit} noValidate className={cn("w-full", compact ? "max-w-sm" : "max-w-md")}>
      <label htmlFor={`${id}-email`} className={cn("text-caption", onDark ? "text-mist" : "text-taupe")}>
        Email address
      </label>
      <div
        className={cn(
          "group mt-2 flex items-center border-b transition-colors duration-200 focus-within:border-champagne",
          onDark ? "border-ivory/35" : "border-obsidian/40",
          status.kind === "invalid" && "border-error focus-within:border-error",
        )}
      >
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.kind === "invalid") setStatus({ kind: "idle" });
          }}
          aria-invalid={status.kind === "invalid"}
          aria-describedby={describedBy}
          className={cn(
            "min-w-0 flex-1 bg-transparent py-3 outline-none",
            onDark ? "text-ivory placeholder:text-ivory/40" : "text-obsidian placeholder:text-taupe/60",
          )}
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="pressable group/btn flex min-h-11 shrink-0 items-center gap-3 pl-4 text-[0.875rem] font-medium tracking-[0.04em]"
        >
          {status.kind === "sending" ? "Sending" : "Subscribe"}
          <HairlineArrow />
        </button>
      </div>

      <div className="mt-3 min-h-[1.5rem] text-caption" aria-live="polite">
        {(status.kind === "invalid" || status.kind === "error") && (
          <p id={`${id}-msg`} className={onDark ? "text-[#e7a08f]" : "text-error"}>
            {status.message}
          </p>
        )}
        {status.kind === "subscribed" && (
          <p className={onDark ? "text-champagne" : "text-antique"}>Subscribed. Look out for our next letter.</p>
        )}
        {status.kind === "not-configured" && (
          <p className={onDark ? "text-mist" : "text-taupe"}>
            Sign-ups open soon. Your address was not stored because the mailing list isn&apos;t connected yet.
          </p>
        )}
      </div>
    </form>
  );
}
