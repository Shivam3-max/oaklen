"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Plate from "@/components/Plate";

// Full-bleed photographic hero, in the manner of the reference boutiques:
// interior photography edge to edge, a dark scrim, and a light display line
// centred over it. The banners cross-fade and the statements rotate together,
// and each banner runs holzer.in's Ken Burns as it comes forward — the change
// of photograph is what hides the reset back to scale 1.
const LINES = [
  <>
    Furniture that <em>outlives</em> trends
  </>,
  <>
    Timeless <em>silhouettes</em>, built by hand
  </>,
  <>
    Solid wood, <em>quietly</em> considered
  </>,
];

export default function HomeHero({ heroSrcs }: { heroSrcs: (string | undefined)[] }) {
  // Always render at least one banner, even before any photograph is uploaded.
  const banners = heroSrcs.length ? heroSrcs : [undefined];
  const [i, setI] = useState(0);
  const bannerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const active = i % banners.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => n + 1), 5600);
    return () => clearInterval(id);
  }, []);

  // Restart the zoom on whichever banner has just come forward. Deliberately
  // not cancelled on cleanup: the outgoing banner holds its zoomed position
  // while it fades, and the incoming one starts from scale 1 under cover of
  // its own fade-in.
  useEffect(() => {
    const el = bannerRefs.current[active];
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [
        { transform: "scale(1) translateY(0)", transformOrigin: "50% 18%" },
        { transform: "scale(1.1) translateY(-15px)", transformOrigin: "50% 0%" },
      ],
      { duration: 7000, easing: "ease-out", fill: "forwards" }
    );
  }, [active]);

  const hasPhoto = banners.some(Boolean);

  return (
    <section id="site-hero" className="relative flex min-h-svh flex-col justify-between overflow-hidden">
      {/* banners */}
      <div className="absolute inset-0 z-[1]">
        {banners.map((src, n) => (
          <div
            key={n}
            ref={(el) => {
              bannerRefs.current[n] = el;
            }}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ opacity: n === active ? 1 : 0 }}
          >
            <Plate
              kind="room"
              ratio="auto"
              bare
              soft
              toneIndex={2 + n}
              src={src}
              alt="An Oaklen interior"
              className="h-full w-full"
            />
          </div>
        ))}
        {/* scrim — tuned so white type reads over either a photograph or the plate */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.52) 0%, rgba(10,10,10,0.30) 38%, rgba(10,10,10,0.40) 72%, rgba(10,10,10,0.62) 100%)",
          }}
        />
      </div>

      {/* centred statement */}
      <div className="relative z-[2] flex flex-1 items-center justify-center px-6 pb-16 pt-32 text-center lg:px-12">
        <div className="w-full max-w-4xl">
          <p className="label mb-8 text-white/70">Panchkula · Est. 2016</p>

          <div className="grid">
            {LINES.map((line, n) => (
              <h1
                key={n}
                data-active={n === i % LINES.length}
                aria-hidden={n !== i % LINES.length}
                className="hero-line serif-display col-start-1 row-start-1 text-[9vw] text-white sm:text-6xl lg:text-[4.6rem]"
              >
                {line}
              </h1>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <Link href="/shop" className="btn-line-light btn-line">
              View the collection
            </Link>
            <Link href="/atelier" className="btn-line-light btn-line">
              Our process
            </Link>
          </div>

          {/* slide dots */}
          <div className="mt-14 flex items-center justify-center gap-3">
            {LINES.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Statement ${n + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  n === i % LINES.length ? "w-6 bg-white" : "bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {!hasPhoto && (
        <span className="label absolute right-6 top-24 z-[2] text-[9px] text-white/45 lg:right-12">
          Photograph forthcoming
        </span>
      )}

      {/* trust strip along the foot of the photograph */}
      <div className="relative z-[2] border-t border-white/20">
        <div className="mx-auto flex max-w-[1500px] flex-wrap justify-center gap-x-10 gap-y-2 px-6 py-5 text-center lg:justify-between lg:px-12">
          {[
            "Solid wood only",
            "Made to order · 14–45 days",
            "8-year structural warranty",
            "Delivered & assembled, pan-India",
          ].map((t) => (
            <span key={t} className="trust text-white/75">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
