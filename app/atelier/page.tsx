import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import Link from "next/link";
import { getSiteImages } from "@/lib/store";
import { addressLine } from "@/data/brand";

export const metadata = { title: "The Atelier — Oaklen" };
export const dynamic = "force-dynamic";

const STEPS = [
  ["01", "Selection", "Every log is graded by hand at the yard. We keep one in five.", "workshop"],
  ["02", "Seasoning", "Ninety days minimum in the drying sheds. Wood that hurries, warps.", "detail"],
  ["03", "Drawing", "Full-scale drawings, still on paper. The pencil finds what the screen misses.", "craft"],
  ["04", "Joinery", "Mortise and tenon, dovetail, wedge. Screws hold hardware, never structure.", "chair"],
  ["05", "Upholstery", "Cut and stitched under north light, where colour tells the truth.", "sofa"],
  ["06", "Finishing", "Oil and wax, rubbed in by hand, twice. Never a sprayed lacquer shell.", "centre"],
  ["07", "The rest", "The piece sits for three days. Joints settle. We check it all again.", "nesting"],
  ["08", "Signature", "Signed and numbered on the underside by the crew that built it.", "portrait"],
] as const;

export default async function AtelierPage() {
  const img = await getSiteImages();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">The Atelier</p>
          <h1 className="serif-display max-w-5xl text-6xl lg:text-[8rem]">
            Slow is a <span className="italic text-walnut">feature.</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-xl leading-relaxed text-umber">
            Oaklen runs one workshop, not a supply chain. Forty-eight craftspeople, four wood species, two upholstery
            benches and a rule we never break: nothing ships until the maker who built it would take it home.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12">
        <Reveal variant="img">
          <Plate kind="workshop" ratio="16/7" plate={40} label={`The floor at ${addressLine}`} toneIndex={3} src={img["atelier-hero"]} alt="Oaklen workshop" />
        </Reveal>
        <div className="mt-6 grid gap-6 border-b hairline pb-10 text-center sm:grid-cols-4">
          {[["48", "craftspeople"], ["90+", "days of seasoning"], ["8 yr", "structural warranty"], ["1 of 5", "logs make the cut"]].map(([n, d], i) => (
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
          {STEPS.map(([n, t, d, kind], i) => (
            <Reveal key={n} delay={(i % 4) * 80}>
              <div>
                <Plate kind={kind} ratio="4/3" toneIndex={i} bare src={img[`atelier-step-${i + 1}`]} alt={t} />
                <p className="label mt-5 text-brass">{n}</p>
                <p className="mt-2 font-serif text-2xl">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-umber">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grain bg-espresso text-ivory">
        <div className="mx-auto max-w-[1500px] px-6 py-24 text-center lg:px-12">
          <Reveal>
            <p className="serif-display mx-auto max-w-3xl text-4xl leading-tight lg:text-6xl">
              “We don&apos;t sell furniture. We take <span className="italic text-clay">commissions.</span>”
            </p>
            <p className="label mt-8 text-ivory/50">— The floor rule, painted above the door</p>
          </Reveal>
          <Reveal delay={150}>
            <Link href="/shop" className="btn-line mt-12 !border-ivory !text-ivory hover:!bg-ivory hover:!text-espresso">
              Book a piece
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
