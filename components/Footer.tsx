import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { BRAND } from "@/data/brand";

export default function Footer() {
  return (
    <footer className="border-t hairline bg-ivory">
      <div className="mx-auto max-w-[1500px] px-6 pt-20 lg:px-12">
        <div className="grid gap-14 pb-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="label mb-4 text-brass">The Ledger</p>
            <p className="serif-display mb-8 max-w-sm text-3xl">
              Furniture notes, once a month. Never a sale banner.
            </p>
            <NewsletterForm />
          </div>
          <div>
            <p className="label mb-6 text-umber">Collection</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/shop?category=living" className="hover:text-brass">Living</Link></li>
              <li><Link href="/shop?category=sleep" className="hover:text-brass">Sleep</Link></li>
              <li><Link href="/shop?category=dine" className="hover:text-brass">Dine</Link></li>
              <li><Link href="/shop?category=accents" className="hover:text-brass">Accents</Link></li>
              <li><Link href="/lookbook" className="hover:text-brass">Rooms</Link></li>
            </ul>
          </div>
          <div>
            <p className="label mb-6 text-umber">House</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/atelier" className="hover:text-brass">The Atelier</Link></li>
              <li><Link href="/journal" className="hover:text-brass">Journal</Link></li>
              <li><Link href="/tools" className="hover:text-brass">Tools</Link></li>
              <li><Link href="/visit" className="hover:text-brass">Visit Us</Link></li>
              <li><Link href="/account" className="hover:text-brass">Your Orders</Link></li>
            </ul>
          </div>
          <div>
            <p className="label mb-6 text-umber">Partners</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/trade" className="hover:text-brass">Oaklen Trade</Link></li>
              <li><Link href="/trade" className="hover:text-brass">Oaklen Build</Link></li>
              <li><Link href="/trade" className="hover:text-brass">Oaklen Circle</Link></li>
              <li><Link href="/trade/dashboard" className="hover:text-brass">Partner Dashboard</Link></li>
            </ul>
            <p className="label mt-8 text-umber">Concierge</p>
            <p className="mt-3 text-sm">{BRAND.phoneDisplay}<br />{BRAND.email}</p>
            <p className="mt-3 text-sm leading-relaxed text-umber">
              {BRAND.address.line1}<br />{BRAND.address.city}, {BRAND.address.state} {BRAND.address.pin}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t hairline py-6">
          <Link href="/policies/privacy" className="label text-[10px] text-umber hover:text-brass">Privacy</Link>
          <Link href="/policies/terms" className="label text-[10px] text-umber hover:text-brass">Terms</Link>
          <Link href="/policies/shipping" className="label text-[10px] text-umber hover:text-brass">Shipping</Link>
          <Link href="/policies/refunds" className="label text-[10px] text-umber hover:text-brass">Returns &amp; refunds</Link>
        </div>
      </div>
      <div className="overflow-hidden px-2">
        <p className="serif-display select-none whitespace-nowrap text-center text-[19vw] leading-[0.78] text-espresso/[0.06]">
          OAKLEN
        </p>
      </div>
      <div className="border-t hairline">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-6 py-5 lg:px-12">
          <p className="label text-[10px] text-umber">© 2026 Oaklen Furniture · Made to be kept</p>
          <p className="label text-[10px] text-umber">Solid wood · 8-year warranty · Pan-India delivery</p>
        </div>
      </div>
    </footer>
  );
}
