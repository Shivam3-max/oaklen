"use client";

import { formatINR } from "@/data/products";
import { IMAGE_SLOTS } from "@/data/siteImages";
import type { AdminData } from "../types";

export default function OverviewTab({ data }: { data: AdminData }) {
  const { orders, products, enquiries, subscribers, siteImages } = data;

  const bookingValue = orders.reduce((s, o) => s + o.subtotal, 0);
  const open = orders.filter((o) => o.status !== "delivered").length;
  const active = products.filter((p) => p.active).length;
  const newEnq = enquiries.filter((e) => e.status === "new").length;
  const filledImages = IMAGE_SLOTS.filter((s) => (siteImages ?? {})[s.key]).length;

  const cards: [string, string, string][] = [
    ["Bookings", String(orders.length), `${open} still open`],
    ["Booking value", formatINR(bookingValue), "across all bookings"],
    ["Catalogue", String(products.length), `${active} live · ${products.length - active} hidden`],
    ["Enquiries", String(enquiries.length), newEnq > 0 ? `${newEnq} awaiting a reply` : "all handled"],
    ["The Ledger", String(subscribers.length), "newsletter subscribers"],
    ["Section photos", `${filledImages} / ${IMAGE_SLOTS.length}`, "uploaded in Media"],
  ];

  return (
    <>
      <div className="mt-12 grid gap-px overflow-hidden border hairline bg-espresso/10 sm:grid-cols-3">
        {cards.map(([t, v, d]) => (
          <div key={t} className="bg-ivory p-8">
            <p className="label text-[10px] text-umber">{t}</p>
            <p className="serif-display mt-3 text-4xl">{v}</p>
            <p className="mt-1 text-xs text-umber">{d}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-umber">
        Bookings are enquiries to buy — no payment is taken on the site. Call the customer to confirm, then move the
        booking through the atelier from the Bookings tab.
      </p>
    </>
  );
}
