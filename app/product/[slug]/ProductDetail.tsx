"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Plate from "@/components/Plate";
import { useCart } from "@/components/CartContext";
import { Product, fabricById, formatINR } from "@/data/products";
import { whatsappLink } from "@/data/brand";

const SERVICEABLE_PREFIX = ["11", "12", "20", "40", "41", "56", "60", "70", "30", "50", "38", "39", "18", "26"];

export default function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [fabric, setFabric] = useState(product.fabrics[0]);
  const [pin, setPin] = useState("");
  const [pinResult, setPinResult] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("wood");
  const [added, setAdded] = useState(false);

  const images = product.images ?? [];
  const [activeImg, setActiveImg] = useState(0);

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setPinResult("Enter a 6-digit PIN code.");
      return;
    }
    const ok = SERVICEABLE_PREFIX.includes(pin.slice(0, 2));
    const eta = new Date();
    eta.setDate(eta.getDate() + product.leadDays + (ok ? 4 : 9));
    setPinResult(
      `${ok ? "White-glove delivery & assembly" : "Doorstep delivery"} to ${pin} · arrives by ${eta.toLocaleDateString("en-IN", { day: "numeric", month: "long" })}.`
    );
  };

  const sections: [string, string, string][] = [
    ["wood", "Wood & build", `${product.wood}. Joined with mortise-and-tenon joinery, finished by hand and inspected twice before it leaves the atelier.`],
    ["care", "Care", "Dust with a dry cotton cloth. Keep two feet from direct heat. Fabric covers accept professional dry cleaning; wood asks only for a yearly wax."],
    ["warranty", "Warranty & returns", "8-year structural warranty on every frame. Seven-day return window after delivery — we collect, no questions asked."],
  ];

  return (
    <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-12 lg:grid-cols-[1.15fr_1fr] lg:px-12">
      {/* gallery */}
      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <Plate
          kind={product.silhouette}
          ratio="5/4"
          plate={product.plate}
          label={product.name}
          toneIndex={product.plate}
          src={images[activeImg]}
          alt={`${product.name} — ${product.line}`}
        />
        {images.length > 1 ? (
          <div className="grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative overflow-hidden border transition-all ${i === activeImg ? "border-brass" : "hairline hover:border-espresso/40"}`}
                style={{ aspectRatio: "1/1" }}
                aria-label={`View photo ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <Plate kind="detail" ratio="4/3" plate={`${product.plate}a`} label="Grain study" toneIndex={product.plate + 1} />
            <Plate kind="craft" ratio="4/3" plate={`${product.plate}b`} label="Maker's hand" toneIndex={product.plate + 2} />
          </div>
        ) : null}
      </div>

      {/* story */}
      <div className="lg:max-w-xl">
        <p className="label text-brass">{product.type} · {product.style}</p>
        <h1 className="serif-display mt-3 text-6xl lg:text-7xl">{product.name}</h1>
        <p className="mt-2 font-serif text-xl italic text-umber">{product.line}</p>

        <p className="mt-6 leading-relaxed text-umber">{product.story}</p>

        <div className="mt-8 border-t hairline pt-6">
          <p className="font-serif text-3xl">{formatINR(product.price)}</p>
        </div>

        {product.fabrics.length > 0 && (
          <div className="mt-8">
            <p className="label mb-4 text-umber">
              Upholstery — <span className="text-espresso">{fabricById(fabric!)?.name}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {product.fabrics.map((id) => {
                const f = fabricById(id)!;
                return (
                  <button
                    key={id}
                    onClick={() => setFabric(id)}
                    aria-label={f.name}
                    className={`h-11 w-11 rounded-full border-2 transition-all ${
                      fabric === id ? "scale-110 border-brass" : "border-transparent hover:border-espresso/30"
                    }`}
                    style={{ background: f.tone }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-t hairline pt-6 text-sm">
          <div><p className="label mb-1 text-[9px] text-umber">Dimensions</p>{product.dims}</div>
          <div><p className="label mb-1 text-[9px] text-umber">Build time</p>{product.leadDays} days, made for you</div>
        </div>

        {/* book */}
        <div className="mt-10 border hairline bg-bone/60 p-6">
          <p className="label text-umber">Book this piece</p>
          <p className="mt-2 text-xs leading-relaxed text-umber">
            Reserve it with your contact details — no payment online. Our team calls you to confirm and arrange delivery.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              className="btn-solid flex-1 justify-center"
              onClick={() => {
                add(product.slug, fabric);
                router.push("/checkout");
              }}
            >
              Book this piece
            </button>
            <button
              className="btn-line flex-1 justify-center"
              onClick={() => {
                add(product.slug, fabric);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
          <a
            href={whatsappLink(`I'd like to talk about the ${product.name} ${product.line}.`)}
            target="_blank"
            rel="noreferrer"
            className="label mt-4 inline-block text-[10px] text-umber underline-offset-4 hover:text-brass hover:underline"
          >
            Or speak to us on WhatsApp
          </a>
        </div>

        {/* pin check */}
        <div className="mt-6 flex items-end gap-4">
          <div className="flex-1">
            <p className="label mb-2 text-[10px] text-umber">Delivery estimate</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit PIN code"
              inputMode="numeric"
            />
          </div>
          <button onClick={checkPin} className="label border-b border-espresso pb-2.5 hover:text-brass">
            Check
          </button>
        </div>
        {pinResult && <p className="mt-3 text-xs text-walnut">{pinResult}</p>}

        {/* accordions */}
        <div className="mt-10 border-t hairline">
          {sections.map(([id, title, body]) => (
            <div key={id} className="border-b hairline">
              <button
                onClick={() => setOpenSection(openSection === id ? null : id)}
                className="flex w-full items-center justify-between py-5 text-left"
              >
                <span className="font-serif text-lg">{title}</span>
                <span className="text-brass">{openSection === id ? "—" : "+"}</span>
              </button>
              {openSection === id && <p className="pb-6 text-sm leading-relaxed text-umber">{body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
