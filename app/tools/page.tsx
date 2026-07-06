import Link from "next/link";
import Reveal from "@/components/Reveal";
import EmiCalculator from "./widgets/EmiCalculator";
import DeliveryEstimator from "./widgets/DeliveryEstimator";
import FabricExplorer from "./widgets/FabricExplorer";

export const metadata = { title: "Tools — Oaklen" };
export const dynamic = "force-dynamic";

import { listProducts } from "@/lib/store";

export default async function ToolsPage() {
  const products = await listProducts();
  return (
    <div className="pt-36">
      <section className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <Reveal>
          <p className="label mb-4 text-brass">The Toolbench</p>
          <h1 className="serif-display max-w-4xl text-6xl lg:text-8xl">
            Measure twice, <span className="italic text-walnut">reserve once.</span>
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-16 lg:px-12">
        <div className="grid gap-px overflow-hidden border hairline bg-espresso/10 md:grid-cols-2">
          <Reveal className="bg-ivory">
            <Link href="/tools/configurator" className="group block h-full p-10 transition-colors hover:bg-bone">
              <p className="label text-brass">Tool 01</p>
              <p className="serif-display mt-4 text-4xl">Sofa configurator</p>
              <p className="mt-3 max-w-sm text-sm text-umber">
                Silhouette, size, fabric, legs — watch the price move as you build your Aria.
              </p>
              <p className="label mt-8 text-espresso/40 group-hover:text-brass">Open the bench →</p>
            </Link>
          </Reveal>
          <Reveal delay={80} className="bg-ivory">
            <Link href="/tools/room-fit" className="group block h-full p-10 transition-colors hover:bg-bone">
              <p className="label text-brass">Tool 02</p>
              <p className="serif-display mt-4 text-4xl">Room fit checker</p>
              <p className="mt-3 max-w-sm text-sm text-umber">
                Type your room&apos;s measurements, drag pieces around a to-scale floor, know before you book.
              </p>
              <p className="label mt-8 text-espresso/40 group-hover:text-brass">Open the floor plan →</p>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-20 px-6 pb-28 lg:grid-cols-3 lg:px-12">
        <Reveal>
          <div>
            <p className="label mb-2 text-brass">Tool 03</p>
            <h2 className="serif-display mb-8 text-3xl">EMI, honestly</h2>
            <EmiCalculator />
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div>
            <p className="label mb-2 text-brass">Tool 04</p>
            <h2 className="serif-display mb-8 text-3xl">When will it arrive?</h2>
            <DeliveryEstimator products={products} />
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div>
            <p className="label mb-2 text-brass">Tool 05</p>
            <h2 className="serif-display mb-8 text-3xl">The fabric wall</h2>
            <FabricExplorer />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
