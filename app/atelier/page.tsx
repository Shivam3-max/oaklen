import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import ProcessIcon, { type ProcessIconKind } from "@/components/ProcessIcon";
import Ambience from "@/components/Ambience";
import Link from "next/link";
import { getSiteImages } from "@/lib/store";
import { addressLine } from "@/data/brand";

export const metadata = { title: "The Atelier — Oaklen" };
export const dynamic = "force-dynamic";

// The real sequence on the Panchkula floor, as set out in the company deck:
// panel cutting, frames, carcass work, hand assembly, springs, foam and
// upholstery, then finishing and the final check.
const STEPS: readonly (readonly [string, string, string, ProcessIconKind])[] = [
  ["01", "Panel cutting", "Board is squared and cut to size on the panel saw. The first cut sets everything after it.", "cutting"],
  ["02", "Frame making", "Frames are built in solid wood, jointed and braced before anything soft goes near them.", "frame"],
  ["03", "Chair frames", "Chair and dining frames are shaped on their own bench, then stacked to wait for upholstery.", "chair"],
  ["04", "Carcass work", "Carcasses for storage, beds and television units — cut, glued and clamped on the floor.", "carcass"],
  ["05", "Hand assembly", "Parts come together by hand. Every joint is checked square before it moves on.", "assembly"],
  ["06", "Springs & webbing", "Serpentine springs and webbing are set across the frame. This is what you feel in ten years.", "springs"],
  ["07", "Foam & upholstery", "Foam is cut to the frame, then the cover is fitted, stitched and pulled by hand.", "foam"],
  ["08", "Finishing & checks", "Polish, hardware, and a last inspection before anything leaves the floor.", "finishing"],
] as const;

export default async function AtelierPage() {
  const img = await getSiteImages();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">The Atelier</p>
          <h1 className="serif-display max-w-5xl text-6xl lg:text-[7rem]">
            Where your furniture <span className="italic text-walnut">is made.</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-xl leading-relaxed text-umber">
            Oaklen makes its own furniture. Fifteen craftsmen across a three-floor workshop take a piece from board to
            polish — cutting, frames, springs, foam, upholstery and finishing, all under one roof. Nothing is
            sub-contracted out, and you are welcome to come and watch it happen.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12">
        <Reveal variant="img">
          <Plate kind="workshop" ratio="16/7" plate={40} label={`The floor at ${addressLine}`} toneIndex={3} src={img["atelier-hero"]} alt="Oaklen workshop" />
        </Reveal>
        <div className="mt-6 grid gap-6 border-b hairline pb-10 text-center sm:grid-cols-4">
          {[["15", "skilled craftsmen"], ["3", "floor workshop"], ["9,000", "sq ft of making"], ["A–Z", "built in house"]].map(([n, d], i) => (
            <Reveal key={d} delay={i * 70}>
              <div className="py-4">
                <p className="serif-display text-5xl">{n}</p>
                <p className="label mt-2 text-[10px] text-umber">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 pb-24 lg:px-12">
        <Reveal>
          <h2 className="serif-display mb-14 text-5xl">Eight steps. No shortcuts.</h2>
        </Reveal>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, t, d, icon], i) => (
            <Reveal key={n} delay={(i % 4) * 80}>
              <div>
                {/* `soft` only applies when no photograph exists — a line drawing next to
                    real workshop shots reads as a mistake, a tonal field reads as pending. */}
                <Plate kind="workshop" ratio="4/3" toneIndex={i} bare soft src={img[`atelier-step-${i + 1}`]} alt={t} />
                <div className="mt-5 flex items-center gap-3">
                  <ProcessIcon kind={icon} className="h-7 w-7 flex-none text-brass" />
                  <p className="label text-brass">{n}</p>
                </div>
                <p className="mt-3 font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-umber">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative text-ivory">
        <Ambience variant="shadow" src={img["atelier-hero"]} feather={false} />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 text-center lg:px-12">
          <Reveal>
            <p className="serif-display mx-auto max-w-4xl text-4xl leading-tight lg:text-6xl">
              Because we make it ourselves, we can{" "}
              <span className="italic text-clay">stand behind every promise.</span>
            </p>
            <p className="label mt-8 text-ivory/50">— Why Oaklen, in one line</p>
          </Reveal>
          <Reveal delay={150}>
            <Link href="/visit" className="btn-line mt-12 !border-ivory !text-ivory hover:!bg-ivory hover:!text-espresso">
              Come and see it being made
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
