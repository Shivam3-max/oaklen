import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import { getSiteImages } from "@/lib/store";
import RewardForm from "./RewardForm";

export const metadata = { title: "Oaklen Rewards" };
export const dynamic = "force-dynamic";

const PERKS = [
  ["Recommend a piece", "Point a friend to Oaklen and there’s a thank-you in it for you."],
  ["Furnish a project", "Doing up a home or a space? We’ll look after you from the first sofa to the last table."],
  ["Simply love furniture", "Anyone can join. Members get first look at new pieces and little rewards along the way."],
];

export default async function RewardsPage() {
  const img = await getSiteImages();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">Oaklen Rewards</p>
          <h1 className="serif-display max-w-4xl text-6xl lg:text-8xl">
            Get awesome <span className="italic text-walnut">rewards</span> from Oaklen.
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 max-w-xl leading-relaxed text-umber">
            One simple programme for everyone — whether you’re recommending a piece to a friend, furnishing a whole
            project, or just someone who loves good furniture. Join in a minute, and we’ll take good care of you.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 lg:px-12">
        <div className="grid gap-px overflow-hidden border hairline bg-espresso/10 lg:grid-cols-3">
          {PERKS.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} className="bg-ivory">
              <div className="flex h-full flex-col p-10">
                <p className="label text-brass">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="serif-display mt-4 text-3xl">{t}</h2>
                <p className="mt-4 text-sm leading-relaxed text-umber">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y hairline bg-bone/50">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-12">
          <div>
            <Reveal>
              <p className="label mb-4 text-brass">Join</p>
              <h2 className="serif-display text-5xl">Become a member.</h2>
              <p className="mt-4 max-w-md text-sm text-umber">
                Leave your details and our team will welcome you to Oaklen Rewards.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <RewardForm />
            </Reveal>
          </div>
          <Reveal delay={100} variant="img">
            <Plate kind="workshop" ratio="4/5" plate={30} label="Inside the Oaklen atelier" toneIndex={3} src={img["trade-preview"]} alt="Oaklen atelier" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
