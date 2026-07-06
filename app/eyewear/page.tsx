import type { Metadata } from "next";
import Link from "next/link";
import { Glasses, Sun, Wrench, Users } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { DisplayCards } from "@/components/ui/display-cards";

export const metadata: Metadata = {
  title: "Eyewear, Frames & Sunglasses",
  description:
    "Prescription glasses, frame styling, and prescription & non-prescription sunglasses at Premier Eye Institute in Creedmoor, NC. Personal fittings, adjustments, and repairs.",
};

const pillars = [
  {
    icon: Glasses,
    title: "Frames that fit your life",
    copy: "Our optical specialists, Maddie and Brianne, help you find frames that suit your face, your prescription, and your day-to-day — no upselling, just honest styling.",
  },
  {
    icon: Sun,
    title: "Sunglasses, with or without Rx",
    copy: "Real UV protection matters as much as style. We carry prescription and non-prescription sunglasses so your eyes stay protected outdoors.",
  },
  {
    icon: Wrench,
    title: "Adjustments & repairs",
    copy: "Frames loosen and life happens. Bring your glasses in for fittings, adjustments, and repairs — usually handled on the spot.",
  },
  {
    icon: Users,
    title: "VSP Premier Program",
    copy: "We accept VSP, including the VSP Premier Program, and we'll help you get the most from your vision benefits when choosing eyewear.",
  },
];

export default function EyewearPage() {
  return (
    <>
      <PageHero
        eyebrow="Eyewear"
        title={
          <>
            Glasses you&apos;ll{" "}
            <em className="italic text-accent">want</em> to wear.
          </>
        }
        lead="An exam tells us what your eyes need. The optical is where it becomes something you love wearing every day."
      />

      <section className="mx-auto max-w-[1080px] px-5 pb-24 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <p className="eyebrow mb-3.5">In the optical</p>
            <h2 className="font-heading text-[clamp(26px,3.6vw,40px)] font-medium leading-[1.1] tracking-[-0.4px] text-ink">
              Three things we do well, every day.
            </h2>
            <p className="mt-4 max-w-[440px] text-[15px] leading-[1.65] text-body-text">
              {pillars[0].copy}{" "}
              And because we accept VSP — including the VSP
              Premier Program — we&apos;ll help you get the most from your
              vision benefits while you choose.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:pr-10">
            <DisplayCards
              cards={[
                {
                  icon: Glasses,
                  title: "Frames",
                  description: "Styled to your face and prescription.",
                  meta: "Honest fittings",
                  className:
                    "md:hover:-translate-y-6 md:[&:not(:hover)]:opacity-95",
                },
                {
                  icon: Sun,
                  title: "Sunglasses",
                  description: "Real UV protection, Rx or not.",
                  meta: "Prescription & non-Rx",
                  className:
                    "md:translate-x-14 md:translate-y-9 md:hover:-translate-y-0.5",
                },
                {
                  icon: Wrench,
                  title: "Adjustments & repairs",
                  description: "Fittings and fixes, usually on the spot.",
                  meta: "Walk-ins welcome",
                  className:
                    "md:translate-x-28 md:translate-y-[4.5rem] md:hover:translate-y-10",
                },
              ]}
            />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 text-center">
          <p className="text-[15px] text-body-text">
            Not sure where to start?{" "}
            <Link
              href="/book"
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              Book an exam
            </Link>{" "}
            and we&apos;ll walk the optical together afterward. Or{" "}
            <Link
              href="/try-on"
              className="font-semibold text-accent underline-offset-4 hover:underline"
            >
              try on a frame virtually
            </Link>{" "}
            with your webcam.
          </p>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}
