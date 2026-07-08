# Security TODO — deferred items

This tracks security work that **could not be completed** under the current
constraints (staying on GitHub Pages; contact form intentionally inert). Each
item lists **why it's deferred** and **what unlocks it**. Items already
implemented are in the "Done" section at the bottom for context.

---

## 1. Migrate hosting to Vercel or Netlify → unlocks real HTTP security headers

**Why deferred:** GitHub Pages cannot set HTTP response headers. We shipped a
partial Content-Security-Policy as a `<meta http-equiv>` tag (see
`app/layout.tsx`), but several critical protections are **header-only** and are
silently ignored in meta form:

- `frame-ancestors` (clickjacking protection; `X-Frame-Options` is also header-only)
- `Strict-Transport-Security` (HSTS — force HTTPS at the browser level)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- CSP `report-uri` / `report-to` (violation reporting)

A meta-tag CSP also only governs content that appears *after* it in the
document, so it is inherently weaker than a response header.

**What unlocks it:** Deploy to a host that supports headers. Next.js is
natively supported on both Vercel and Netlify (zero config for this app).

**Copy-paste for migration day** — drop this `vercel.json` at the repo root.
It sets the full header suite AND promotes the CSP from meta to a real header
(you can then delete the `<meta http-equiv="Content-Security-Policy">` from
`app/layout.tsx`). Note: `next.config.ts` currently uses `output: "export"`
for static Pages — on Vercel you can remove `output: "export"` and `basePath`
to run it as a normal Next app, or keep the export and let Vercel serve it
statically; either way `vercel.json` headers apply.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
        },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

> Note the CSP header value adds `frame-ancestors 'none'` (not possible in the
> meta version). `Permissions-Policy` keeps `camera=(self)` because the
> virtual try-on needs the webcam on our own origin; microphone/geolocation are
> denied. If you keep `basePath`, the `source` still matches because headers
> apply by path on the deployed origin.

**Alternative (stay on Next, no vercel.json):** if you drop `output: "export"`,
you can instead move these into `next.config.ts` via an `async headers()`
function. Equivalent effect; use whichever matches the final host.

---

## 2. Wire the contact form to a real service → then implement the hardening TODO

**Why deferred:** Team decision pending on the backend (Formspree / Resend /
custom API route). The form is intentionally **inert** today — it validates
client-side and simulates the submit; no data leaves the browser, so there is
no live spam/abuse/injection surface yet.

**What's already in place (pre-wiring):**

- Shared validation schema in `lib/contact-schema.ts` (Zod) — designed to be
  re-imported **server-side** unchanged.
- Client-side validation applies that schema on submit with inline errors.
- Honeypot field (`components/contact/contact-form.tsx`) — hidden, off-screen,
  `aria-hidden`, `tabIndex={-1}`; a filled value is treated as spam.
- A visible disclaimer near the message field (no sensitive medical details;
  not for emergencies).

**What unlocks it:** a backend decision. When wiring up, implement the
`TODO(form-backend)` block in `components/contact/contact-form.tsx`:

1. **Rate limiting** on the receiving endpoint (per-IP throttle).
2. **Server-side validation** — re-run `contactSchema` on the raw payload.
   Never trust the client pass alone.
3. **Escape/encode** every field before rendering it into any email/HTML
   template (prevent HTML and email-header injection).
4. **Spam protection** — re-check the honeypot server-side AND add a real
   challenge (Cloudflare Turnstile / hCaptcha).
5. **Transport** — POST over HTTPS; add a CSRF token if the endpoint is
   same-origin and cookie-authenticated.

---

## 3. HUMAN TASKS (cannot be done in code)

These require account/dashboard access and must be done by a person:

- [ ] **Enable GitHub 2FA** for every collaborator on the repo
      (`remember-the-titans/premier-eye-institute`). Whoever controls the repo
      controls what deploys to the live site — this is the single highest-value
      real-world risk reduction.
- [ ] **Audit repo collaborator write access** — remove anyone who doesn't need
      push access; prefer least privilege.
- [ ] **Audit Personal Access Tokens / deploy tokens** — revoke unused ones,
      scope the rest minimally, set expirations.
- [ ] **When a custom domain is purchased** (e.g. peicare.com): enable **2FA at
      the domain registrar and DNS provider**, and lock the domain against
      transfer. Domain/DNS hijacking redirects the entire site regardless of how
      secure the code is.
- [ ] **On GitHub Pages settings:** confirm **"Enforce HTTPS"** is checked
      (Settings → Pages) so `http://` requests redirect to `https://`.

---

## 4. Dependency status — postcss advisory (RESOLVED, note the mechanism)

The `npm audit` postcss advisory (GHSA-qx2v-qp2m-jg93, moderate, build-time
only) **is resolved** — `npm audit` now reports **0 vulnerabilities**.

- Root cause: Next.js `16.2.10` (the latest release in our major line — there
  is no newer 16.x to update to) pins `postcss@8.4.31` as a direct dependency,
  and the fix landed in `postcss@8.5.10`.
- Fix applied: an `overrides` entry in `package.json` (`"postcss": "^8.5.10"`)
  forces the transitive postcss up to a patched, semver-compatible minor
  (8.5.x) **without downgrading Next.js**. `npm audit fix --force` was NOT used
  (it would downgrade Next to v9 and break the build).
- **Watch item:** when upgrading Next.js in the future, re-check whether this
  override is still needed (if a future Next release pins postcss ≥ 8.5.10, the
  override can be removed). Re-run `npm audit` after any dependency bump.

---

## Done (implemented in this pass — for context)

- ✅ **postcss advisory** patched via `overrides` (see §4). `npm audit` clean.
- ✅ **Self-hosted MediaPipe** WASM + FaceLandmarker model under
  `public/mediapipe/` — removed the runtime `cdn.jsdelivr.net` /
  `storage.googleapis.com` dependency (supply-chain surface). Loaded via
  `withBasePath()` so it works under the Pages subpath.
- ✅ **Partial CSP** as `<meta http-equiv>` in `app/layout.tsx`, tailored to the
  site's actual load sources. (Full header-based policy → §1.)
- ✅ **Contact form pre-hardening** — shared Zod schema, honeypot, client-side
  validation, disclaimer. (Backend hardening → §2.)
- ✅ **Verified clean:** no committed secrets / `.env`; `.mcp.json` gitignored;
  all `target="_blank"` links carry `rel="noopener noreferrer"`; the only
  `dangerouslySetInnerHTML` is the static JSON-LD block (no user input).
