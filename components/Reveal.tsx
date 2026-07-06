"use client";

import { useEffect, useRef } from "react";

let rafAlive = false;
if (typeof window !== "undefined") {
  requestAnimationFrame(() => {
    rafAlive = true;
  });
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "img";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;
    let failsafe: number | undefined;
    let done = false;

    const reveal = (instant = false) => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      if (instant) {
        el.style.transition = "none";
        el.querySelectorAll<HTMLElement>(":scope > *").forEach((c) => (c.style.transition = "none"));
        el.classList.add("is-in");
      } else {
        timer = window.setTimeout(() => el.classList.add("is-in"), delay);
      }
    };

    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) reveal();
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    // environments without animation frames (some embedded previews) never
    // fire scroll events — show everything rather than hide content
    failsafe = window.setTimeout(() => {
      if (!rafAlive) reveal(true);
    }, 1200);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      if (timer) window.clearTimeout(timer);
      if (failsafe) window.clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`${variant === "img" ? "reveal-img" : "reveal"} ${className}`}>
      {children}
    </div>
  );
}
