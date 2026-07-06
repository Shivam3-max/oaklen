import Reveal from "@/components/Reveal";
import Plate from "@/components/Plate";
import ShoppableRoom from "@/components/home/ShoppableRoom";
import Link from "next/link";
import { listProducts } from "@/lib/store";

export const metadata = { title: "Rooms — the Oaklen Lookbook" };
export const dynamic = "force-dynamic";

const ROOMS = [
  { plate: 21, title: "The Ivory Room", note: "Aria, Pebble, Meadow — the quiet default." },
  { plate: 22, title: "A Study in Walnut", note: "Bramble and Atlas, for rooms with books." },
  { plate: 23, title: "The Long Table", note: "Longford set for eight, morning light." },
  { plate: 24, title: "Sleep, North-Facing", note: "Nocturne in Oat Linen, nothing else." },
];

export default async function Lookbook() {
  const products = await listProducts();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">The Lookbook</p>
          <h1 className="serif-display max-w-4xl text-6xl lg:text-8xl">
            Rooms, <span className="italic text-walnut">not products.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-umber">
            Each room below is fully shoppable once photography arrives — the first one already is. Touch the points.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-16 lg:px-12">
        <Reveal delay={100}>
          <ShoppableRoom products={products} />
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {ROOMS.slice(1).map((r, i) => (
            <Reveal key={r.plate} delay={i * 90}>
              <div>
                <Plate kind="room" ratio="4/3" plate={r.plate} label={r.title} toneIndex={i + 1} />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <p className="font-serif text-2xl">{r.title}</p>
                  <p className="label text-[9px] text-umber">Shoppable soon</p>
                </div>
                <p className="mt-1 text-sm text-umber">{r.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="mt-20 border-t hairline pt-10 text-center">
            <p className="font-serif text-2xl">Want your room in the next lookbook?</p>
            <Link href="/visit" className="btn-line mt-6">Book a design consultation</Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
