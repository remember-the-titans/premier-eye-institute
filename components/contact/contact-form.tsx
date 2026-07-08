"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { site } from "@/lib/site";
import { contactSchema, HONEYPOT_FIELD } from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // After a failed submit re-renders, move focus to the first invalid field.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>("[aria-invalid='true']")
      ?.focus();
  }, [errors]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a hidden field no human fills. If it's populated, silently
    // treat as spam — show the normal success state so bots get no signal,
    // but never "send". (Also re-checked server-side when the form is wired.)
    if (String(data.get(HONEYPOT_FIELD) ?? "").trim() !== "") {
      setStatus("success");
      return;
    }

    // Validate with the SHARED schema (lib/contact-schema.ts) — the same one
    // the server must re-run once this form talks to a real backend.
    const result = contactSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      topic: String(data.get("topic") ?? "appointment"),
      message: String(data.get("message") ?? ""),
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "");
        if (field && !next[field]) next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    setStatus("submitting");

    // ─────────────────────────────────────────────────────────────────────
    // TODO(form-backend): NO real submission is wired up yet — this only
    // simulates the round trip so the loading + confirmation UX is complete.
    // Before connecting this to a real service (Formspree / Resend / an API
    // route), the following MUST be added — see SECURITY_TODO.md:
    //   1. Rate limiting on the receiving endpoint (per-IP throttle) to blunt
    //      spam/abuse floods.
    //   2. Server-side validation by re-running `contactSchema` on the raw
    //      payload — never trust this client-side pass alone.
    //   3. Escape/encode every field before rendering it into any email or
    //      HTML template (prevent HTML/header injection in the notification).
    //   4. Spam protection: re-check the honeypot server-side AND add a
    //      real challenge (e.g. Cloudflare Turnstile / hCaptcha) since a
    //      honeypot alone won't stop a targeted bot.
    //   5. Transport: POST over HTTPS only; consider a CSRF token if the
    //      endpoint is same-origin and cookie-authenticated.
    // ─────────────────────────────────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex h-full min-h-[380px] flex-col items-center justify-center gap-4 rounded-lg border border-ink/[0.07] bg-white p-8 text-center shadow-warm"
      >
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-accent-tint text-success">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-2xl font-semibold text-ink">
          Message sent
        </h3>
        <p className="max-w-xs text-[14.5px] leading-relaxed text-body-text">
          Thanks — we&apos;ll get back to you within one business day. Need us
          sooner? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-accent">
            {site.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-lg border border-ink/[0.07] bg-white p-6 shadow-warm sm:p-8"
    >
      <h3 className="font-heading text-2xl font-semibold text-ink">
        Send us a message
      </h3>
      <p className="mt-1.5 text-[13.5px] text-body-text">
        Questions about services, insurance, or appointments — we&apos;ll
        reply within one business day.
      </p>

      {/*
        Honeypot — a decoy field for spam bots. Hidden off-screen (not
        display:none, which some bots skip), removed from the tab order, and
        aria-hidden so screen readers ignore it entirely. A real visitor never
        sees or fills it; a non-empty value is treated as spam in onSubmit.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="cf-company">Company (leave this field blank)</label>
        <input
          id="cf-company"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-1.5">
          <Label htmlFor="cf-name">
            Name <span aria-hidden="true" className="text-error">*</span>
          </Label>
          <Input
            id="cf-name"
            name="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            className="h-11 rounded-md"
          />
          {errors.name && (
            <p id="cf-name-error" role="alert" className="text-[13px] text-error">
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="cf-phone">Phone</Label>
            <Input
              id="cf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "cf-phone-error" : undefined}
              className="h-11 rounded-md"
            />
            {errors.phone && (
              <p id="cf-phone-error" role="alert" className="text-[13px] text-error">
                {errors.phone}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cf-email">Email</Label>
            <Input
              id="cf-email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "cf-email-error" : undefined}
              className="h-11 rounded-md"
            />
            {errors.email && (
              <p id="cf-email-error" role="alert" className="text-[13px] text-error">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cf-topic">What can we help with?</Label>
          <Select name="topic" defaultValue="appointment">
            <SelectTrigger id="cf-topic" className="h-11 w-full rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Booking an appointment</SelectItem>
              <SelectItem value="exam">Eye or vision exam</SelectItem>
              <SelectItem value="contacts">Contact lenses</SelectItem>
              <SelectItem value="eyewear">Glasses or sunglasses</SelectItem>
              <SelectItem value="insurance">Insurance or billing</SelectItem>
              <SelectItem value="other">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="cf-message">
            Message <span aria-hidden="true" className="text-error">*</span>
          </Label>
          <Textarea
            id="cf-message"
            name="message"
            rows={4}
            maxLength={2000}
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message
                ? "cf-message-error cf-message-note"
                : "cf-message-note"
            }
            className="rounded-md"
          />
          {errors.message && (
            <p id="cf-message-error" role="alert" className="text-[13px] text-error">
              {errors.message}
            </p>
          )}
          <p id="cf-message-note" className="text-[12px] leading-relaxed text-soft">
            Please don&apos;t include sensitive medical details here. This form
            isn&apos;t monitored for emergencies — for urgent medical needs,
            call 911.
          </p>
        </div>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="press min-h-12 rounded-full bg-accent text-[15px] font-semibold text-white shadow-cta transition-[transform,translate,background-color,border-color] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover disabled:translate-y-0"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
