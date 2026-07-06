import Link from "next/link";
import { getOrder } from "@/lib/store";
import { formatINR } from "@/data/products";

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order: id } = await searchParams;
  const order = id ? await getOrder(id) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 text-center">
        <h1 className="serif-display text-5xl">We couldn&apos;t find that reservation.</h1>
        <Link href="/account" className="btn-line mt-10">Look up your orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-40 lg:px-12">
      <p className="label mb-4 text-brass">Reservation {order.id}</p>
      <h1 className="serif-display text-6xl lg:text-7xl">
        It&apos;s on the bench, <span className="italic text-walnut">{order.customer.name.split(" ")[0]}.</span>
      </h1>
      <p className="mt-6 max-w-lg leading-relaxed text-umber">
        The atelier has your commission. You&apos;ll hear from the concierge within a day, and again when your piece
        enters the upholstery house. A written confirmation is on its way to {order.customer.email || "your phone"}.
      </p>

      <div className="mt-12 border hairline bg-bone/60 p-8">
        <div className="space-y-3 text-sm">
          {order.items.map((it) => (
            <div key={it.slug} className="flex justify-between">
              <span>{it.name} — {it.line} × {it.qty}{it.fabric ? ` · ${it.fabric}` : ""}</span>
              <span>{formatINR(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t hairline pt-3"><span>Paid today ({order.paymentMode})</span><span>{formatINR(order.paidNow)}</span></div>
          {order.balanceDue > 0 && (
            <div className="flex justify-between text-umber"><span>Due on delivery</span><span>{formatINR(order.balanceDue)}</span></div>
          )}
          {order.refCode && (
            <div className="flex justify-between text-walnut"><span>Referred by</span><span>{order.refCode}</span></div>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-6">
        <Link href="/account" className="btn-line">Track this order</Link>
        <Link href="/shop" className="label self-center border-b border-espresso/40 pb-1 hover:border-brass hover:text-brass">
          Keep browsing →
        </Link>
      </div>
    </div>
  );
}
