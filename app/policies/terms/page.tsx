import PolicyShell from "../PolicyShell";
import { BRAND, addressLine } from "@/data/brand";

export const metadata = { title: "Terms of Service — Oaklen" };

export default function TermsPage() {
  return (
    <PolicyShell kicker="Legal" title="Terms of service" updated="July 2026">
      <p>
        These terms govern your use of this website and any order you place with {BRAND.legalName} (“Oaklen”). By
        reserving or purchasing a piece, you accept these terms.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Made to order</h2>
      <p>
        Almost every Oaklen piece is built to order. The build time shown on each product is an estimate from the day
        your order is confirmed. Because pieces are hand-made in solid wood, small natural variations in grain, colour
        and finish are inherent to the material and are not defects.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Booking</h2>
      <p>
        You book a piece by giving your contact details on this website — no payment is taken online, and no prices are
        published here. Every piece is made to order, so our team will call you to confirm the piece and quote it
        against your specification. Quotes are in Indian Rupees and include applicable taxes unless stated otherwise.
        A quote is valid for 30 days and nothing is binding until we confirm your booking.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Cancellation</h2>
      <p>
        You may cancel a made-to-order piece within 48 hours of confirming it. After production begins, any advance you
        have paid toward materials may be retained to cover work already committed.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Warranty</h2>
      <p>
        Because we build in our own workshop, we stand behind what we make. The warranty term for a piece is confirmed
        in writing when we quote it, and covers manufacturing defects under normal domestic use. It does not cover
        ordinary wear, accidental damage, or the natural ageing of wood, leather and fabric. For anything that needs
        attention after delivery, call us and our team will come out.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Oaklen Rewards</h2>
      <p>
        Oaklen Rewards is open to anyone. Rewards are offered at our discretion and may change over time. We may adjust
        or withhold a reward where a booking is cancelled, returned, or found to be fraudulent.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Contact</h2>
      <p>
        {BRAND.legalName}, {addressLine}. Phone {BRAND.phoneDisplay} · Email{" "}
        <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a>.
      </p>
    </PolicyShell>
  );
}
