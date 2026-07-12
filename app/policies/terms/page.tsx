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

      <h2 className="serif-display pt-4 text-2xl">Reserving and paying</h2>
      <p>
        You may reserve a piece with a token amount (15% of the value) and pay the balance on delivery, or pay in full at
        checkout. Prices are in Indian Rupees and include applicable taxes unless stated otherwise. We reserve the right
        to correct any pricing errors before your order is confirmed.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Cancellation</h2>
      <p>
        You may cancel a made-to-order piece within 48 hours of placing it for a full refund of any amount paid. After
        production begins, the token amount becomes non-refundable as work and materials have been committed, but you may
        still cancel the balance.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Warranty</h2>
      <p>
        Every frame carries an 8-year structural warranty against manufacturing defects under normal domestic use. This
        does not cover ordinary wear, accidental damage, or the natural ageing of wood, leather and fabric.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Partner programme</h2>
      <p>
        Commissions under the Oaklen Trade, Build and Circle programmes are earned on delivered orders and paid monthly.
        We may adjust or withhold a commission where an order is cancelled, returned, or found to be fraudulent.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Contact</h2>
      <p>
        {BRAND.legalName}, {addressLine}. Phone {BRAND.phoneDisplay} · Email{" "}
        <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a>.
      </p>
    </PolicyShell>
  );
}
