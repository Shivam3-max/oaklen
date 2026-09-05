import Link from "next/link";
import Plate from "@/components/Plate";
import Reveal from "@/components/Reveal";
import Ambience from "@/components/Ambience";
import ProductCard from "@/components/ProductCard";
import CategoryIndex from "@/components/home/CategoryIndex";
import SplitWorlds from "@/components/home/SplitWorlds";
import ShoppableRoom from "@/components/home/ShoppableRoom";
import HomeHero from "@/components/home/HomeHero";
import { formatINR } from "@/data/products";
import { listProducts, getSiteImages } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, img] = await Promise.all([listProducts(), getSiteImages()]);
  const signature = products.find((p) => p.slug === "aria-three-seater") ?? products[0];
  const arrivals = products.slice(1, 20).filter((p) => p.slug !== signature.slug).slice(0, 4);
  const journal = [
    { slug: "how-to-read-wood-grain", title: "How to read a wood grain", tag: "Craft Notes" },
    { slug: "the-case-for-slow-furniture", title: "The case for slow furniture", tag: "Essay" },
    { slug: "caring-for-boucle", title: "Caring for bouclé, briefly", tag: "Care" },
  ];

  return (
    <>
      {/* 01 — Full-bleed hero */}
      <HomeHero heroSrcs={[img["home-hero"], img["home-hero-2"]]} />

      {/* 02 — Category band */}
      <section className="relative">
        <Ambience variant="mist" src={img["home-hero-2"]} />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <p className="label rule mb-6 text-brass">The Collection</p>
              <h2 className="section-title text-4xl lg:text-5xl">Sit. Sleep. Gather.</h2>
              <p className="mt-5 max-w-lg leading-relaxed text-umber">
                Four rooms, one workshop. Every piece drawn, joined and finished by the
                same set of hands in Panchkula.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <CategoryIndex images={img} />
          </Reveal>
        </div>
      </section>

      {/* 03 — Design philosophy / the signature piece.
             The signature photograph doubles as this band's ground, thrown
             out of focus behind the copy. */}
      <section className="relative">
        <Ambience variant="cream" src={img["home-signature"]} />
        <div className="relative z-[1] mx-auto grid max-w-[1500px] gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12 lg:py-36">
          <Reveal variant="img">
            <Plate
              kind="sofa"
              ratio="4/5"
              bare
              toneIndex={0}
              plate={signature.plate}
              src={img["home-signature"] ?? signature.images?.[0]}
              alt={signature.name}
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="label rule mb-7 text-brass">Our design philosophy</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="section-title text-4xl lg:text-[3.25rem]">
                Low, long,
                <br />
                <span className="italic lowercase tracking-[-0.03em] text-walnut">quiet.</span>
              </h2>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-7 max-w-md leading-relaxed text-umber">{signature.story}</p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 max-w-md leading-relaxed text-umber">
                From classical to contemporary, the drawing is deliberately unfussy — so the
                timber, the joint and the cloth are what you notice.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="panel mt-10 grid max-w-md grid-cols-3 gap-6 p-6 text-sm">
                <div>
                  <p className="label mb-2 text-[9px] text-umber">Frame</p>
                  Kiln-dried teak
                </div>
                <div>
                  <p className="label mb-2 text-[9px] text-umber">Build time</p>
                  21 days
                </div>
                <div>
                  <p className="label mb-2 text-[9px] text-umber">From</p>
                  {formatINR(signature.price)}
                </div>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <Link href={`/product/${signature.slug}`} className="btn-line mt-11">
                Commission this piece
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — Two temperaments */}
      <section className="relative">
        <Ambience variant="sage" src={img["home-split-classic"]} />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="label rule mb-6 text-brass">Two hands</p>
                <h2 className="section-title text-4xl lg:text-5xl">Two temperaments. One workshop.</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-umber">
                Every Oaklen piece is drawn in one of two hands. Choose yours.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SplitWorlds modernImage={img["home-split-modern"]} classicImage={img["home-split-classic"]} />
          </Reveal>
        </div>
      </section>

      {/* 05 — The atelier, on a defocused photograph of the workshop */}
      <section className="relative overflow-hidden">
        <Ambience variant="shadow" src={img["atelier-hero"]} feather={false} />

        {!img["atelier-hero"] && (
          <span className="label absolute right-6 top-8 z-[2] text-[9px] text-white/40 lg:right-12">
            Photograph forthcoming
          </span>
        )}

        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-28 lg:px-12 lg:py-40">
          <Reveal>
            <p className="label rule mb-8 text-clay">The Atelier</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="section-title max-w-3xl text-4xl text-white lg:text-[3.5rem]">
              48 hands. 21 days.
              <br />
              <span className="italic lowercase text-clay">one piece.</span>
            </h2>
          </Reveal>

          {/* the numbers the workshop already stands behind */}
          <Reveal delay={160}>
            <div className="panel-dark mt-16 grid gap-10 p-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["90", "days seasoned", "Minimum, before a board is cut"],
                ["21", "days on the bench", "Per commissioned piece"],
                ["8", "year warranty", "Structural, in writing"],
                ["48", "hands", "From timber yard to signature"],
              ].map(([n, t, d]) => (
                <div key={t}>
                  <p className="serif-display text-6xl text-white lg:text-7xl">{n}</p>
                  <p className="label mt-3 text-[10px] text-clay">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Timber yard", "Teak, sheesham, oak and mango — seasoned a minimum of 90 days."],
              ["02", "The joinery", "Mortise and tenon. Dovetail. No staples where a joint belongs."],
              ["03", "Upholstery house", "Cut, stitched and buttoned by hand under north light."],
              ["04", "The signature", "Every piece signed and numbered by the hands that built it."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 90}>
                <div>
                  <p className="label mb-3 text-[10px] text-clay">{n}</p>
                  <p className="section-title text-lg text-white">{t}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <Link href="/atelier" className="btn-line btn-line-light mt-16">
              Walk through the workshop
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 06 — Shoppable room */}
      <section className="relative">
        <Ambience variant="mist" src={img["home-room"]} />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label rule mb-6 text-brass">In situ</p>
                <h2 className="section-title text-4xl lg:text-5xl">Shop the room</h2>
              </div>
              <p className="label text-[10px] text-umber">Touch a point · four pieces live here</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ShoppableRoom products={products} image={img["home-room"]} />
          </Reveal>
        </div>
      </section>

      {/* 07 — New arrivals */}
      <section className="relative">
        <Ambience variant="cream" parallax />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label rule mb-6 text-brass">New</p>
                <h2 className="section-title text-4xl lg:text-5xl">Recently off the bench</h2>
              </div>
              <Link href="/shop" className="label border-b border-espresso/30 pb-1 text-[10px] hover:border-brass hover:text-brass">
                All pieces →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} toneIndex={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — Testimonial, over a defocused interior */}
      <section className="relative">
        <Ambience variant="mist" src={img["home-hero"]} />
        <div className="relative z-[1] mx-auto max-w-4xl px-6 py-24 text-center lg:py-36">
          <Reveal>
            <p className="label mb-10 text-brass">Hear our clients&rsquo; voices</p>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="serif-display text-3xl leading-[1.28] lg:text-[2.75rem]">
              &ldquo;Guests sit on the Bramble and go quiet for a second.
              <span className="italic text-walnut"> That pause is what we paid for.&rdquo;</span>
            </blockquote>
          </Reveal>
          <Reveal delay={180}>
            <p className="label mt-10 text-[10px] text-umber">
              The Kapoor residence, New Delhi · Bramble Chesterfield, Saddle Leather
            </p>
          </Reveal>
        </div>
      </section>

      {/* 09 — Rewards */}
      <section className="relative">
        <Ambience variant="sage" />
        <div className="relative z-[1] mx-auto grid max-w-[1500px] gap-10 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-24">
          <div>
            <Reveal>
              <p className="label rule mb-6 text-brass">Oaklen Rewards</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="section-title max-w-2xl text-3xl lg:text-[2.5rem]">
                Get awesome rewards from Oaklen.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-lg leading-relaxed text-umber">
                Recommend a piece, furnish a project, or simply love good furniture — join
                Oaklen Rewards and we&rsquo;ll take good care of you.
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <Link href="/rewards" className="btn-sage">Join rewards</Link>
          </Reveal>
        </div>
      </section>

      {/* 10 — Journal */}
      <section className="relative">
        <Ambience variant="cream" />
        <div className="relative z-[1] mx-auto max-w-[1500px] px-6 py-24 lg:px-12 lg:py-32">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label rule mb-6 text-brass">The Journal</p>
                <h2 className="section-title text-4xl lg:text-5xl">Notes from the bench</h2>
              </div>
              <Link href="/journal" className="label border-b border-espresso/30 pb-1 text-[10px] hover:border-brass hover:text-brass">
                All entries →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
            {journal.map((j, i) => (
              <Reveal key={j.slug} delay={i * 90}>
                <Link href={`/journal/${j.slug}`} data-cursor="view" className="group block">
                  <div className="overflow-hidden">
                    <Plate
                      kind={["craft", "workshop", "detail"][i] as "craft"}
                      ratio="3/2"
                      bare
                      toneIndex={i}
                      src={img[`journal-${j.slug}`]}
                      alt={j.title}
                      className="tile-img"
                    />
                  </div>
                  <p className="label mt-6 text-[9px] text-brass">{j.tag}</p>
                  <p className="section-title mt-3 text-xl leading-snug transition-colors duration-500 group-hover:text-brass">
                    {j.title}
                  </p>
                  <p className="label mt-5 text-[9px] text-umber">Read more →</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
