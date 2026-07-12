import PolicyShell from "../PolicyShell";
import { BRAND, addressLine } from "@/data/brand";

export const metadata = { title: "Shipping & Delivery — Oaklen" };

export default function ShippingPage() {
  return (
    <PolicyShell kicker="Legal" title="Shipping & delivery" updated="July 2026">
      <p>
        {BRAND.legalName} delivers hand-built furniture across India. Because each piece is made to order, delivery
        happens in two stages: the build, then the shipping.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Build time</h2>
      <p>
        Each product page shows its build time — typically 14 to 45 days from the day your order is confirmed. Larger or
        more intricate pieces take longer, and we will always tell you honestly if a piece is running behind.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Delivery time</h2>
      <p>
        Once built, delivery adds roughly 4 days for white-glove delivery and assembly in serviceable metro pin codes,
        and up to 9 days for doorstep delivery elsewhere. You can check the estimate for your pin code on any product
        page or in the Tools section before you order.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Delivery charges</h2>
      <p>
        Delivery and assembly are complimentary across mainland India. For remote locations or upper-floor deliveries
        without a service lift, we will confirm any additional handling charge with you before dispatch.
      </p>

      <h2 className="serif-display pt-4 text-2xl">On the day</h2>
      <p>
        Our team will call to schedule a convenient slot, deliver the piece, and — where included — assemble it and take
        away the packaging. Please inspect your piece on delivery and note any concern with our team at that time.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Contact</h2>
      <p>
        Questions about a delivery? Call {BRAND.phoneDisplay} or email{" "}
        <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a>.{" "}
        {BRAND.legalName}, {addressLine}.
      </p>
    </PolicyShell>
  );
}
