import Link from "next/link";
import Plate from "@/components/Plate";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import CategoryIndex from "@/components/home/CategoryIndex";
import SplitWorlds from "@/components/home/SplitWorlds";
import ShoppableRoom from "@/components/home/ShoppableRoom";
import { formatINR } from "@/data/products";
import { listProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();
  const signature = products.find((p) => p.slug === "aria-three-seater") ?? products[0];
  const arrivals = products.slice(1, 20).filter((p) => p.slug !== signature.slug).slice(0, 4);
  const journal = [
    { slug: "how-to-read-wood-grain", title: "How to read a wood grain", tag: "Craft Notes" },
    { slug: "the-case-for-slow-furniture", title: "The case for slow furniture", tag: "Essay" },
    { slug: "caring-for-boucle", title: "Caring for bouclé, briefly", tag: "Care" },
  ];

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pb-14 pt-36 lg:px-12">
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[44%] lg:block">
          <div style={{ animation: "drift 14s ease-in-out infinite alternate" }} className="h-[106%]">
            <Plate kind="room" ratio="auto" toneIndex={1} bare className="h-full" />
          </div>
        </div>
        <div className="relative z-[2] max-w-[1500px]">
          <Reveal>
            <p className="label mb-6 flex items-center gap-4 text-brass">
              <span className="inline-block h-px w-12 bg-brass" />
              An Indian furniture atelier · Est. plate No. 001
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="serif-display max-w-5xl text-[13.5vw] leading-[0.96] sm:text-8xl lg:text-[9.5rem]">
              Furniture that <em className="text-walnut">outlives</em> trends.
            </h1>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Link href="/shop" className="btn-solid">Reserve a piece</Link>
              <Link href="/atelier" className="label border-b border-espresso/40 pb-1 transition-colors hover:border-brass hover:text-brass">
                Inside the atelier
              </Link>
            </div>
          </Reveal>
          <Reveal delay={380}>
            <div className="mt-16 flex flex-wrap gap-x-12 gap-y-3 text-[13px] text-umber">
              <span>Solid wood only</span>
              <span>Made to order · 14–45 days</span>
              <span>8-year structural warranty</span>
              <span>Delivered & assembled, pan-India</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — Category index */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
        <Reveal>
          <p className="label mb-10 text-umber">The Collection — choose a room</p>
        </Reveal>
        <Reveal delay={100}>
          <CategoryIndex />
        </Reveal>
      </section>

      {/* 03 — Signature piece */}
      <section className="border-y hairline bg-bone/50">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-32">
          <Reveal variant="img">
            <Plate kind="sofa" ratio="5/4" toneIndex={2} plate={signature.plate} label={`${signature.name} — Signature`} />
          </Reveal>
          <div className="lg:pl-10">
            <Reveal>
              <p className="label mb-4 text-brass">The Signature — 01 of 03</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="serif-display text-6xl lg:text-7xl">
                Aria.<br />
                <span className="italic text-walnut">Low, long, quiet.</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-md leading-relaxed text-umber">{signature.story}</p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 grid max-w-md grid-cols-3 gap-6 border-t hairline pt-6 text-sm">
                <div><p className="label mb-1 text-[9px] text-umber">Frame</p>Kiln-dried teak</div>
                <div><p className="label mb-1 text-[9px] text-umber">Build time</p>21 days</div>
                <div><p className="label mb-1 text-[9px] text-umber">From</p>{formatINR(signature.price)}</div>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <Link href={`/product/${signature.slug}`} className="btn-line mt-10">
                Commission this piece
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Modern / Classic */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="serif-display max-w-xl text-5xl lg:text-6xl">Two temperaments. One workshop.</h2>
            <p className="max-w-xs text-sm text-umber">Every Oaklen piece is drawn in one of two hands. Choose yours.</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SplitWorlds />
        </Reveal>
      </section>

      {/* 05 — Atelier band (the one dark section) */}
      <section className="grain bg-espresso text-ivory">
        <div className="mx-auto max-w-[1500px] px-6 py-28 lg:px-12 lg:py-36">
          <Reveal>
            <p className="label mb-8 text-brass">The Atelier</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="serif-display max-w-4xl text-6xl lg:text-8xl">
              48 hands. 21 days. <span className="italic text-clay">One piece.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-10 border-t border-ivory/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Timber yard", "Teak, sheesham, oak and mango — seasoned a minimum of 90 days."],
              ["02", "The joinery", "Mortise and tenon. Dovetail. No staples where a joint belongs."],
              ["03", "Upholstery house", "Cut, stitched and buttoned by hand under north light."],
              ["04", "The signature", "Every piece signed and numbered by the hands that built it."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 90}>
                <div>
                  <p className="label mb-3 text-brass">{n}</p>
                  <p className="font-serif text-2xl">{t}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link href="/atelier" className="label mt-14 inline-block border-b border-ivory/40 pb-1 text-ivory transition-colors hover:border-brass hover:text-brass">
              Walk through the workshop →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 06 — Shoppable room */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="serif-display text-5xl lg:text-6xl">Shop the room</h2>
            <p className="label text-umber">Touch a point · four pieces live here</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <ShoppableRoom products={products} />
        </Reveal>
      </section>

      {/* 07 — New arrivals strip */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12">
          <Reveal>
            <p className="label mb-10 text-umber">Recently off the bench</p>
          </Reveal>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} toneIndex={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Trade invitation */}
      <section className="border-t hairline bg-linen/60">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
          <div>
            <Reveal>
              <p className="label mb-4 text-brass">Oaklen Trade · Build · Circle</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="serif-display max-w-2xl text-4xl lg:text-5xl">
                Architects, builders, and friends of the house — earn with every commission.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-lg text-sm text-umber">
                Up to 12% on referred pieces, trade pricing, a project estimator, and a dashboard that shows every rupee moving toward you.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <Link href="/trade" className="btn-line">Become a partner</Link>
          </Reveal>
        </div>
      </section>

      {/* 09 — Testimonial */}
      <section className="mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
        <Reveal>
          <p className="label mb-10 text-umber">From the houses we furnish</p>
        </Reveal>
        <Reveal delay={100}>
          <blockquote className="serif-display max-w-4xl text-4xl leading-[1.15] lg:text-6xl">
            “Guests sit on the Bramble and go quiet for a second.
            <span className="italic text-walnut"> That pause is what we paid for.”</span>
          </blockquote>
        </Reveal>
        <Reveal delay={180}>
          <p className="label mt-8 text-umber">— The Kapoor residence, New Delhi · Bramble Chesterfield, Saddle Leather</p>
        </Reveal>
      </section>

      {/* 10 — Journal teaser */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12">
          <Reveal>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="serif-display text-4xl lg:text-5xl">The Journal</h2>
              <Link href="/journal" className="label border-b border-espresso/40 pb-1 hover:border-brass hover:text-brass">
                All entries →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-px overflow-hidden border hairline bg-espresso/10 md:grid-cols-3">
            {journal.map((j, i) => (
              <Link key={j.slug} href={`/journal/${j.slug}`} className="group bg-ivory p-8 transition-colors duration-500 hover:bg-bone">
                <p className="label mb-6 text-brass">{j.tag}</p>
                <p className="font-serif text-2xl leading-snug">{j.title}</p>
                <p className="label mt-8 text-espresso/40 transition-colors group-hover:text-brass">Read — 0{i + 1}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
