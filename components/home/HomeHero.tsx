"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Plate from "@/components/Plate";

// The Plane Reveal hero: on load a carpenter's plane pushes a panel of raw
// timber off to the right, revealing the finished piece and the headline
// beneath. The rested state is already revealed (see globals.css), so if
// animation is unsupported or reduced-motion is on, the hero is simply correct
// and static. Uses the uploaded home-hero photo when present, else the plate.
export default function HomeHero({ heroSrc }: { heroSrc?: string }) {
  const rawRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rawRef.current;
    if (!el || typeof el.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(101%)" }],
      { duration: 2000, delay: 200, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "backwards" }
    );
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      {/* finished state — revealed as the plane passes */}
      <div className="absolute inset-0 z-[1]">
        <Plate kind="sofa" ratio="auto" bare toneIndex={2} src={heroSrc} alt="Oaklen furniture" className="h-full w-full" />
        {/* scrims keep the headline legible over a photo or the plate */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(105deg, rgba(247,244,239,0.94) 0%, rgba(247,244,239,0.68) 34%, rgba(247,244,239,0.12) 62%, rgba(247,244,239,0) 82%)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: "linear-gradient(to top, rgba(247,244,239,0.82), rgba(247,244,239,0))" }}
        />
      </div>

      {/* content — sits beneath the timber, uncovered by the plane */}
      <div className="relative z-[2] px-6 pb-14 pt-36 lg:px-12">
        <div className="max-w-[1500px]">
          <p className="label mb-6 flex items-center gap-4 text-brass">
            <span className="inline-block h-px w-12 bg-brass" />
            An Indian furniture atelier · Panchkula
          </p>
          <h1 className="serif-display max-w-5xl text-[13.5vw] leading-[0.96] sm:text-8xl lg:text-[9.5rem]">
            Furniture that <em className="text-walnut">outlives</em> trends.
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Link href="/shop" className="btn-solid">Reserve a piece</Link>
            <Link href="/atelier" className="label border-b border-espresso/40 pb-1 transition-colors hover:border-brass hover:text-brass">
              Inside the atelier
            </Link>
          </div>
          <div className="mt-16 flex flex-wrap gap-x-12 gap-y-3 text-[13px] text-umber">
            <span>Solid wood only</span>
            <span>Made to order · 14–45 days</span>
            <span>8-year structural warranty</span>
            <span>Delivered &amp; assembled, pan-India</span>
          </div>
        </div>
      </div>

      {/* raw timber, planed away on load; the blade edge rides its trailing side */}
      <div ref={rawRef} className="plane-raw absolute inset-0 z-[3]" aria-hidden="true">
        <div className="plane-blade absolute" />
      </div>
    </section>
  );
}
