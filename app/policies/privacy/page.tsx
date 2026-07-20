import PolicyShell from "../PolicyShell";
import { BRAND, addressLine } from "@/data/brand";

export const metadata = { title: "Privacy Policy — Oaklen" };

export default function PrivacyPage() {
  return (
    <PolicyShell kicker="Legal" title="Privacy policy" updated="July 2026">
      <p>
        This policy explains how {BRAND.legalName} (“Oaklen”, “we”, “us”) collects, uses and protects the information
        you share when you browse this website, reserve a piece, or contact us. By using the site you agree to this policy.
      </p>

      <h2 className="serif-display pt-4 text-2xl">What we collect</h2>
      <p>
        When you book a piece or make an enquiry we collect your name, phone number, email address, and delivery
        address. No payment is taken on this website, so we do not collect or store any card or bank details. We also
        collect basic, non-identifying analytics about how the site is used.
      </p>

      <h2 className="serif-display pt-4 text-2xl">How we use it</h2>
      <p>
        We use your details only to confirm and deliver your booking, keep you updated on its progress, respond to your
        enquiries, and — if you subscribe — send you our occasional newsletter. We do not sell your data to anyone.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Who we share it with</h2>
      <p>
        We share the minimum necessary with the partners who help us run the business: our delivery and logistics
        partners, and our email provider. Each is bound to protect your information.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Cookies</h2>
      <p>
        We use a small number of cookies to keep your cart working. You can clear these at any time in your browser.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Your rights</h2>
      <p>
        You may ask us to show, correct, or delete the personal information we hold about you. Write to{" "}
        <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a> and we
        will respond within a reasonable time.
      </p>

      <h2 className="serif-display pt-4 text-2xl">Contact</h2>
      <p>
        {BRAND.legalName}, {addressLine}. Phone {BRAND.phoneDisplay} · Email{" "}
        <a href={`mailto:${BRAND.email}`} className="text-brass underline underline-offset-4">{BRAND.email}</a>.
      </p>
    </PolicyShell>
  );
}
