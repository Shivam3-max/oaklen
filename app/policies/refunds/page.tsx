import PolicyShell from "../PolicyShell";
import { BRAND, addressLine } from "@/data/brand";

export const metadata = { title: "Returns & Refunds — Oaklen" };

export default function RefundsPage() {
  return (
    <PolicyShell kicker="Legal" title="Returns & refunds" updated="July 2026">
      <p>
        We want you to live with your Oaklen piece for years. If something isn’t right, here is exactly how returns and
        refunds work.
      </p>

      <h2 className="serif-display pt-4 text-2xl">7-day return window</h2>
      <p>
        You have 7 days from delivery to return a piece for any reason. Tell us within that window and we will arrange
        collection at no cost to you, and refund everything you paid once the piece is back with us in its original
        condition.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Damaged or defective on arrival</h2>
      <p>
        If a piece arrives damaged or with a manufacturing defect, contact us within 48 hours with photos. We will
        repair or replace it, or offer a full refund — your choice — and cover all logistics.
      </p>

      <h2 className="serif-display pt-4 text-2xl">How refunds are paid</h2>
      <p>
        Since no payment is taken on this website, any refund applies only to amounts you paid us directly — for example
        on delivery. Approved refunds are returned by the same method and typically reach you within 5–7 business days.
      </p>

      <h2 className="serif-display pt-4 text-2xl">What isn’t covered</h2>
      <p>
        The 7-day window does not apply to bespoke pieces made to a custom size or specification you requested, as these
        cannot be resold. Natural variation in wood, leather and fabric is not a defect. Ordinary wear over time is not
        covered by a return, though the structural warranty still applies.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Start a return</h2>
      <p>
        Email <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a> or
        call {BRAND.phoneDisplay} with your order number and we’ll take it from there. {BRAND.legalName}, {addressLine}.
      </p>
    </PolicyShell>
  );
}
