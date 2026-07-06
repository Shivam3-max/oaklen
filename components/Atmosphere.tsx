"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function Atmosphere() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const cursor = document.getElementById("cursor");
    let cx = -100, cy = -100, tx = -100, ty = -100;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const view = (e.target as HTMLElement).closest("[data-cursor='view']");
      cursor?.classList.toggle("is-view", !!view);
    };
    let cursorRaf = 0;
    const cursorLoop = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      cursorRaf = requestAnimationFrame(cursorLoop);
    };
    window.addEventListener("mousemove", onMove);
    cursorRaf = requestAnimationFrame(cursorLoop);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(cursorRaf);
      window.removeEventListener("mousemove", onMove);
      lenis.destroy();
    };
  }, []);

  return (
    <div id="cursor" aria-hidden="true">
      <span>VIEW</span>
    </div>
  );
}
