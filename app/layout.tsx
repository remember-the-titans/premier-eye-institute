import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";
import { site } from "@/lib/site";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://peicare.com"),
  title: {
    default: "Eye Doctor in Creedmoor, NC | Premier Eye Institute",
    template: "%s | Premier Eye Institute",
  },
  description:
    "Premier Eye Institute is an independent optometry practice in Creedmoor, NC led by Dr. Nisha Mehta, OD. Comprehensive eye exams, contact lens fittings, LASIK co-management, and eyewear. Call (919) 734-2273 to book.",
  keywords: [
    "eye doctor Creedmoor NC",
    "optometrist Creedmoor",
    "eye exam Creedmoor",
    "contact lenses Creedmoor NC",
    "Premier Eye Institute",
  ],
  openGraph: {
    title: "Eye Doctor in Creedmoor, NC | Premier Eye Institute",
    description:
      "Comprehensive, unhurried eye care in Creedmoor, NC. Exams, contact lenses, LASIK co-management, and eyewear from Dr. Nisha Mehta, OD.",
    url: "https://peicare.com",
    siteName: "Premier Eye Institute",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Optician",
  name: site.legalName,
  url: site.currentSite,
  telephone: `+1-${site.phone}`,
  faxNumber: `+1-${site.fax}`,
  foundingDate: String(site.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "08:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "15:00" },
  ],
  sameAs: [site.facebook, site.twitter],
  founder: { "@type": "Person", name: site.doctor, jobTitle: "Optometrist" },
};

/*
  Content-Security-Policy — partial, GitHub-Pages-compatible stopgap.

  GitHub Pages can't set HTTP response headers, so we ship CSP as a
  <meta http-equiv> tag instead. This is weaker than a real header (see
  caveats below) but still meaningfully constrains what can execute/load.
  The policy is tailored to what THIS site actually loads (audited from the
  static export), not a copy-pasted generic policy:

    - script-src: 'self' for our chunks + 'unsafe-inline' because Next's
      static export emits ~30 inline hydration scripts (self.__next_f.push)
      and a static export cannot attach a per-request nonce. 'wasm-unsafe-eval'
      is required for the self-hosted MediaPipe FaceLandmarker WASM (try-on).
    - style-src: 'unsafe-inline' for the ~46 inline style="" attributes React
      / framer-motion / Tailwind emit; there is no way to nonce those here.
    - font-src / img-src: 'self' — next/font self-hosts the woff2 files and all
      images live under /public. No third-party font or image CDNs.
    - connect-src: 'self' — the only runtime fetches are the self-hosted
      MediaPipe wasm/model under /mediapipe (CDN dependency removed in the
      supply-chain fix). data:/blob: cover WASM + canvas/worker internals.
    - object-src 'none', base-uri 'self', form-action 'self' — hardening with
      no cost to this site (no <object>, no external form posts).

  Dev-only: Turbopack HMR needs 'unsafe-eval' and a websocket, so those are
  added only when NODE_ENV !== 'production'. They are NOT present in the
  exported production build that ships to Pages.

  NOT enforceable via <meta> (silently ignored by browsers in meta form) —
  these require real HTTP headers and are deferred to the Vercel/Netlify
  migration (see SECURITY_TODO.md):
    - frame-ancestors  (clickjacking; X-Frame-Options is also header-only)
    - report-uri / report-to  (violation reporting)
    - Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy
  Also note: a <meta> CSP only governs content that appears after it in the
  document, so it is inherently a partial control vs. a response header.
*/
const isDev = process.env.NODE_ENV !== "production";
const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  `media-src 'self' blob:`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-src 'none'`,
];
const cspContent = cspDirectives.join("; ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Keep first in <head> so the policy governs as much of the document
            as a meta-tag CSP can. See the block comment above for rationale
            and the directives that must move to HTTP headers post-migration. */}
        <meta httpEquiv="Content-Security-Policy" content={cspContent} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCtaBar />
      </body>
    </html>
  );
}
