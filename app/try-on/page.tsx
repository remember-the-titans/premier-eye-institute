import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { CtaBand } from "@/components/site/cta-band";
import { VirtualTryOn } from "@/components/tryon/virtual-try-on";

export const metadata: Metadata = {
  title: "Try On Glasses",
  description:
    "Try on eyewear frames virtually using your webcam — an experimental preview feature from Premier Eye Institute.",
};

export default function TryOnPage() {
  return (
    <>
      <PageHero
        eyebrow="Experimental"
        title={
          <>
            Try it on, <em className="italic text-accent">virtually</em>.
          </>
        }
        lead="A live preview using your webcam and on-device face tracking. Placeholder frame shown below — real frame styles are coming soon."
      />

      <section className="pb-24">
        <VirtualTryOn />
      </section>

      <CtaBand />
    </>
  );
}
