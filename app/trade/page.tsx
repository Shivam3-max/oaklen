import Link from "next/link";
import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import ApplyForm from "./ApplyForm";
import { getSiteImages } from "@/lib/store";

export const metadata = { title: "Partners — Oaklen Trade, Build & Circle" };
export const dynamic = "force-dynamic";

const TIERS = [
  {
    id: "trade", name: "Oaklen Trade", rate: "10–12%", who: "Architects & interior designers",
    perks: ["Trade pricing on the full collection", "Project estimator with your code embedded", "Swatch & timber sample kits, couriered", "A dedicated atelier manager"],
  },
  {
    id: "build", name: "Oaklen Build", rate: "7–8%", who: "Builders & contractors",
    perks: ["Bulk & project quotations", "Staged delivery scheduling by tower / floor", "Site-measured installation", "Net-30 settlement on projects"],
  },
  {
    id: "circle", name: "Oaklen Circle", rate: "5%", who: "Friends of the house — anyone",
    perks: ["A personal link & code, instantly", "5% of every referred piece, or 7% in store credit", "Your referred friend gets free fabric protection", "Payouts monthly, UPI or bank"],
  },
];

export default async function TradePage() {
  const img = await getSiteImages();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">Partners of the house</p>
          <h1 className="serif-display max-w-4xl text-6xl lg:text-8xl">
            You bring the room. <span className="italic text-walnut">We split the reward.</span>
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-xl leading-relaxed text-umber">
            Three programs, one engine. Share your link or let clients quote your code at checkout — either way the
            commission lands in your dashboard, marked pending until the piece is delivered, then paid out monthly.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12">
        <div className="grid gap-px overflow-hidden border hairline bg-espresso/10 lg:grid-cols-3">
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 100} className="bg-ivory">
              <div className="flex h-full flex-col p-10">
                <p className="label text-brass">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="serif-display mt-4 text-4xl">{t.name}</h2>
                <p className="mt-2 text-sm text-umber">{t.who}</p>
                <p className="serif-display mt-8 text-6xl">{t.rate}</p>
                <p className="label mt-1 text-[10px] text-umber">of every referred order</p>
                <ul className="mt-8 flex-1 space-y-3 border-t hairline pt-6 text-sm text-umber">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y hairline bg-bone/50">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-6 py-24 lg:grid-cols-2 lg:px-12">
          <div>
            <Reveal>
              <p className="label mb-4 text-umber">How the ledger works</p>
              <h2 className="serif-display text-5xl">Four steps, no fine print.</h2>
            </Reveal>
            <div className="mt-10 space-y-8">
              {[
                ["Apply below", "Approval within a day. Your code and link are minted instantly."],
                ["Share it", "A link that remembers your client for 30 days — or a code they can simply say out loud."],
                ["The piece is delivered", "Commission moves from pending to confirmed the day the client signs for it."],
                ["Monthly payout", "UPI or bank transfer, first week of every month, statement attached."],
              ].map(([t, d], i) => (
                <Reveal key={t} delay={i * 80}>
                  <div className="flex gap-6">
                    <span className="label pt-1 text-brass">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-serif text-xl">{t}</p>
                      <p className="mt-1 text-sm text-umber">{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="mt-12 border hairline bg-ivory p-6">
                <p className="label mb-2 text-[10px] text-umber">Already a partner?</p>
                <Link href="/trade/dashboard" className="font-serif text-xl underline decoration-brass underline-offset-4 hover:text-brass">
                  Open your dashboard →
                </Link>
              </div>
            </Reveal>
          </div>
          <div>
            <Reveal variant="img">
              <Plate kind="workshop" ratio="4/5" plate={30} label="Partners' preview, the atelier" toneIndex={3} src={img["trade-preview"]} alt="Oaklen atelier" />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="apply" className="mx-auto max-w-3xl px-6 py-24 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">Join</p>
          <h2 className="serif-display text-5xl">Apply in a minute.</h2>
        </Reveal>
        <Reveal delay={120}>
          <ApplyForm />
        </Reveal>
      </section>
    </div>
  );
}
