import { z } from "zod";

/**
 * Shared contact-form validation schema.
 *
 * Intentionally framework-agnostic (pure Zod, no client/server-only imports)
 * so the SAME schema validates on the client today AND can be re-imported by
 * the server/edge handler the day the form is wired to a real backend
 * (Formspree/Resend/API route). Client-side validation is UX only and is
 * trivially bypassed — the server MUST re-run this schema on the raw payload.
 *
 * See components/contact/contact-form.tsx for the deferred-submission TODO
 * block and SECURITY_TODO.md for the full "wire up the form" checklist.
 */

/**
 * Honeypot field name. A hidden input real users never see or fill, but naive
 * bots auto-populate. Shared as a constant so the client render and the future
 * server-side check agree on the name. Any non-empty value ⇒ treat as spam.
 */
export const HONEYPOT_FIELD = "company";

/** Topic options — kept in sync with the <Select> in the contact form. */
export const CONTACT_TOPICS = [
  "appointment",
  "exam",
  "contacts",
  "eyewear",
  "insurance",
  "other",
] as const;

/** Strip everything but digits, for lenient phone validation. */
const digitsOnly = (value: string) => value.replace(/\D/g, "");

/**
 * Phone is optional, but when provided we accept the common US formats people
 * actually type — "919-734-2273", "(919) 734-2273", "919.734.2273",
 * "9197342273", "+1 919 734 2273" — by normalizing to digits and requiring a
 * 10-digit number (or 11 digits starting with a country-code 1).
 */
const isAcceptablePhone = (value: string) => {
  if (value.trim() === "") return true; // optional
  const d = digitsOnly(value);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};

const isAcceptableEmail = (value: string) => {
  if (value.trim() === "") return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const contactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Please tell us your name.")
      .max(100, "That name is too long."),
    email: z
      .string()
      .trim()
      .max(254, "That email is too long.")
      .refine(isAcceptableEmail, {
        message: "That email doesn't look right — check for typos.",
      }),
    phone: z
      .string()
      .trim()
      .max(32, "That phone number is too long.")
      .refine(isAcceptablePhone, {
        message: "Enter a 10-digit phone, e.g. 919-734-2273.",
      }),
    topic: z.enum(CONTACT_TOPICS).optional(),
    message: z
      .string()
      .trim()
      .min(1, "Let us know how we can help.")
      .max(2000, "Please keep your message under 2000 characters."),
  })
  // Need at least one way to reach the person back.
  .refine((d) => d.phone.trim() !== "" || d.email.trim() !== "", {
    message: "Add a phone number or email so we can reach you.",
    path: ["phone"],
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
