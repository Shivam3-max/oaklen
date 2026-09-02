"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const LINKS = [
  { href: "/shop", label: "Collection" },
  { href: "/atelier", label: "Our Process" },
  { href: "/lookbook", label: "Rooms" },
  { href: "/tools", label: "Tools" },
  { href: "/rewards", label: "Rewards" },
];

export default function Nav() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lenis drives a virtual scroll, so window.scrollY never leaves 0. Watch the
  // hero's rendered geometry instead: while any of it still sits under the bar,
  // the bar is over photography; once it has passed, the bar goes solid. Pages
  // without a hero (everything but "/") are solid from the first paint.
  useEffect(() => {
    const hero = document.getElementById("site-hero");
    if (!hero) {
      setScrolled(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "-76px 0px 0px 0px", threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  // Only the homepage opens on a full-bleed photograph, so only there does the
  // bar sit light-on-transparent before the first scroll.
  const onPhoto = pathname === "/" && !scrolled && !open;

  const link = onPhoto
    ? "text-white/85 hover:text-white"
    : "text-espresso/75 hover:text-brass";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        onPhoto ? "bg-transparent" : "border-b hairline bg-ivory/95 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-6 lg:px-12">
        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.slice(0, 3).map((l) => (
            <Link key={l.href} href={l.href} className={`label text-[10px] transition-colors ${link}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className={`label text-[10px] lg:hidden ${onPhoto ? "text-white" : "text-espresso"}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <Link
          href="/"
          className={`font-serif text-lg font-light tracking-[0.42em] transition-colors ${
            onPhoto ? "text-white" : "text-espresso"
          }`}
        >
          OAKLEN
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.slice(3).map((l) => (
            <Link key={l.href} href={l.href} className={`label text-[10px] transition-colors ${link}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/account" className={`label text-[10px] transition-colors ${link}`}>
            Account
          </Link>
          <Link
            href="/cart"
            className={`label flex items-center gap-1.5 text-[10px] transition-colors ${
              onPhoto ? "text-white" : "text-espresso"
            }`}
          >
            Cart
            <span
              className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[9px] ${
                onPhoto ? "bg-white text-espresso" : "bg-espresso text-white"
              }`}
            >
              {count}
            </span>
          </Link>
        </nav>

        <Link href="/cart" className={`label text-[10px] lg:hidden ${onPhoto ? "text-white" : "text-espresso"}`}>
          Cart ({count})
        </Link>
      </div>

      {open && (
        <div className="border-t hairline bg-ivory px-6 py-8 lg:hidden">
          <nav className="flex flex-col gap-5">
            {[...LINKS, { href: "/journal", label: "Journal" }, { href: "/visit", label: "Visit" }, { href: "/account", label: "Account" }].map((l) => (
              <Link key={l.href} href={l.href} className="serif-display text-3xl text-espresso">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
