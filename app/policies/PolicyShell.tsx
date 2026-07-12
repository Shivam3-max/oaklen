import Reveal from "@/components/Reveal";

export default function PolicyShell({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-36 lg:px-0">
      <Reveal>
        <p className="label mb-4 text-brass">{kicker}</p>
        <h1 className="serif-display text-5xl lg:text-7xl">{title}</h1>
        <p className="label mt-6 text-[10px] text-umber">Last updated {updated}</p>
      </Reveal>
      <Reveal delay={100}>
        <div className="policy mt-12 space-y-6 leading-[1.85] text-espresso/85">{children}</div>
      </Reveal>
    </div>
  );
}
