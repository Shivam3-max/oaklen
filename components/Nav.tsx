"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

const LINKS = [
  { href: "/shop", label: "Collection" },
  { href: "/atelier", label: "Atelier" },
  { href: "/lookbook", label: "Rooms" },
  { href: "/tools", label: "Tools" },
  { href: "/trade", label: "Trade" },
];

export default function Nav() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ivory/90 backdrop-blur-md border-b hairline" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-12">
        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.slice(0, 3).map((l) => (
            <Link key={l.href} href={l.href} className="label text-espresso/80 transition-colors hover:text-brass">
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="label lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? "Close" : "Menu"}
        </button>
        <Link href="/" className="font-serif text-xl tracking-[0.28em] text-espresso">
          OAKLEN
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.slice(3).map((l) => (
            <Link key={l.href} href={l.href} className="label text-espresso/80 transition-colors hover:text-brass">
              {l.label}
            </Link>
          ))}
          <Link href="/account" className="label text-espresso/80 transition-colors hover:text-brass">
            Account
          </Link>
          <Link href="/cart" className="label flex items-center gap-1.5 text-espresso transition-colors hover:text-brass">
            Cart
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-espresso px-1 text-[9px] text-ivory">
              {count}
            </span>
          </Link>
        </nav>
        <Link href="/cart" className="label lg:hidden">
          Cart ({count})
        </Link>
      </div>
      {open && (
        <div className="border-t hairline bg-ivory px-6 py-8 lg:hidden">
          <nav className="flex flex-col gap-5">
            {[...LINKS, { href: "/journal", label: "Journal" }, { href: "/visit", label: "Visit" }, { href: "/account", label: "Account" }].map((l) => (
              <Link key={l.href} href={l.href} className="font-serif text-2xl text-espresso">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
