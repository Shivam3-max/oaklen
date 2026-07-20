"use client";

import { useState } from "react";
import Plate from "@/components/Plate";
import MultiImageUploader from "@/components/MultiImageUploader";
import { FABRICS, formatINR, Silhouette, Category, Style, MAX_PRODUCT_IMAGES } from "@/data/products";
import { PRODUCT_IMAGE_SIZE } from "@/data/siteImages";
import type { AdminData, Act, StoredProduct } from "../types";

const SILHOUETTES: { id: Silhouette; label: string }[] = [
  { id: "sofa", label: "Sofa — straight" },
  { id: "sofa-curved", label: "Sofa — curved" },
  { id: "sofa-chester", label: "Sofa — chesterfield" },
  { id: "sectional", label: "Sectional" },
  { id: "armchair", label: "Armchair" },
  { id: "bed", label: "Bed — upholstered" },
  { id: "bed-canopy", label: "Bed — canopy" },
  { id: "bed-platform", label: "Bed — platform" },
  { id: "dining", label: "Dining — rectangular" },
  { id: "dining-round", label: "Dining — round" },
  { id: "chair", label: "Chair" },
  { id: "centre", label: "Centre table" },
  { id: "centre-marble", label: "Centre — marble" },
  { id: "nesting", label: "Nesting tables" },
  { id: "pillow", label: "Pillow" },
  { id: "throw", label: "Throw" },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "living", label: "Living" },
  { id: "sleep", label: "Sleep" },
  { id: "dine", label: "Dine" },
  { id: "accents", label: "Accents" },
];

interface FormState {
  name: string; line: string; category: Category; type: string; style: Style;
  silhouette: Silhouette; price: string; dims: string; wood: string;
  leadDays: string; story: string; fabrics: string[]; images: string[];
}

const EMPTY: FormState = {
  name: "", line: "", category: "living", type: "", style: "modern",
  silhouette: "sofa", price: "", dims: "", wood: "", leadDays: "21", story: "", fabrics: [], images: [],
};

function ProductForm({
  initial, onSubmit, onCancel, submitLabel, busy,
}: {
  initial: FormState;
  onSubmit: (f: FormState) => void;
  onCancel?: () => void;
  submitLabel: string;
  busy: boolean;
}) {
  const [f, setF] = useState<FormState>(initial);
  const set = (k: keyof FormState, v: string | string[] | null) => setF({ ...f, [k]: v });

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <p className="label mb-3 text-[9px] text-umber">Product photos — {PRODUCT_IMAGE_SIZE.label} · shown on the shop grid and product page, replaces the placeholder</p>
        <MultiImageUploader
          images={f.images}
          width={PRODUCT_IMAGE_SIZE.w}
          height={PRODUCT_IMAGE_SIZE.h}
          max={MAX_PRODUCT_IMAGES}
          onChange={(imgs) => setF({ ...f, images: imgs })}
        />
      </div>
      <input placeholder="Name — e.g. Aria" value={f.name} onChange={(e) => set("name", e.target.value)} />
      <input placeholder="Line — e.g. Three-Seater Sofa" value={f.line} onChange={(e) => set("line", e.target.value)} />
      <div>
        <p className="label mb-2 text-[9px] text-umber">Category</p>
        <select value={f.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div>
        <p className="label mb-2 text-[9px] text-umber">Style</p>
        <select value={f.style} onChange={(e) => set("style", e.target.value)}>
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
        </select>
      </div>
      <div>
        <p className="label mb-2 text-[9px] text-umber">Plate silhouette (used until photos land)</p>
        <select value={f.silhouette} onChange={(e) => set("silhouette", e.target.value)}>
          {SILHOUETTES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      <input placeholder="Type — e.g. Sofa" value={f.type} onChange={(e) => set("type", e.target.value)} />
      <input placeholder="Price in ₹ — e.g. 168000" inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} />
      <input placeholder="Build days — e.g. 21" inputMode="numeric" value={f.leadDays} onChange={(e) => set("leadDays", e.target.value.replace(/\D/g, ""))} />
      <input placeholder="Dimensions — e.g. 220 × 95 × 78 cm" value={f.dims} onChange={(e) => set("dims", e.target.value)} />
      <input placeholder="Wood / build — e.g. Kiln-dried teak frame" value={f.wood} onChange={(e) => set("wood", e.target.value)} />
      <textarea placeholder="Story — two sentences the product page tells" rows={2} value={f.story} onChange={(e) => set("story", e.target.value)} className="sm:col-span-2" />
      <div className="sm:col-span-2">
        <p className="label mb-3 text-[9px] text-umber">Upholstery options (leave empty for non-upholstered)</p>
        <div className="flex flex-wrap gap-2">
          {FABRICS.map((fb) => {
            const on = f.fabrics.includes(fb.id);
            return (
              <button
                key={fb.id}
                onClick={() => set("fabrics", on ? f.fabrics.filter((x) => x !== fb.id) : [...f.fabrics, fb.id])}
                className={`flex items-center gap-2 border px-3 py-2 text-[10px] tracking-wide transition-all ${on ? "border-brass bg-bone" : "hairline text-umber hover:border-espresso/40"}`}
              >
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: fb.tone }} />
                {fb.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 sm:col-span-2">
        <button onClick={() => onSubmit(f)} disabled={busy} className="btn-solid !py-3 disabled:opacity-50">
          {busy ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="label self-center text-[10px] text-umber hover:text-brass">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function toForm(p: StoredProduct): FormState {
  return {
    name: p.name, line: p.line, category: p.category, type: p.type, style: p.style,
    silhouette: p.silhouette, price: String(p.price), dims: p.dims, wood: p.wood,
    leadDays: String(p.leadDays), story: p.story, fabrics: p.fabrics, images: p.images ?? [],
  };
}

function fromForm(f: FormState) {
  return {
    name: f.name, line: f.line, category: f.category, type: f.type || f.line, style: f.style,
    silhouette: f.silhouette, price: Number(f.price), dims: f.dims, wood: f.wood,
    leadDays: Number(f.leadDays), story: f.story, fabrics: f.fabrics, images: f.images,
  };
}

export default function ProductsTab({ data, act }: { data: AdminData; act: Act }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const run = async (body: Record<string, unknown>, done?: () => void) => {
    setBusy(true);
    setError(null);
    const err = await act(body);
    setBusy(false);
    if (err) setError(err);
    else done?.();
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-umber">
          {data.products.length} pieces · {data.products.filter((p) => p.active).length} live on the site
        </p>
        <button onClick={() => { setAdding(!adding); setEditing(null); }} className="btn-line !py-3">
          {adding ? "Close" : "+ Add a piece"}
        </button>
      </div>

      {error && <p className="mt-4 text-xs text-[#8a3a2a]">{error}</p>}

      {adding && (
        <div className="mt-8 border border-brass bg-bone/40 p-8">
          <p className="label mb-6 text-brass">New piece — joins the catalogue immediately</p>
          <ProductForm
            initial={EMPTY}
            submitLabel="Add to catalogue"
            busy={busy}
            onSubmit={(f) => run({ action: "product-create", product: fromForm(f) }, () => setAdding(false))}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {data.products.map((p) => (
          <div key={p.slug} className={`border hairline ${p.active ? "" : "opacity-55"}`}>
            <div className="flex flex-wrap items-center gap-6 p-5">
              <div className="w-20 shrink-0">
                <Plate kind={p.silhouette} ratio="1/1" toneIndex={p.plate} bare src={p.images?.[0]} />
              </div>
              <div className="min-w-44 flex-1">
                <p className="font-serif text-xl">
                  {p.name} <span className="text-sm italic text-umber">· {p.line}</span>
                </p>
                <p className="mt-1 text-xs text-umber">
                  PL. {String(p.plate).padStart(2, "0")} · {p.category} · {p.style} · {p.leadDays} days
                  {!p.active && <span className="text-walnut"> · hidden from site</span>}
                </p>
              </div>
              <p className="font-serif text-lg">{formatINR(p.price)}</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setEditing(editing === p.slug ? null : p.slug); setAdding(false); }}
                  className="label text-[10px] text-umber hover:text-brass"
                >
                  {editing === p.slug ? "Close" : "Edit"}
                </button>
                <button
                  onClick={() => run({ action: "product-update", slug: p.slug, patch: { active: !p.active } })}
                  className="label text-[10px] text-umber hover:text-brass"
                >
                  {p.active ? "Hide" : "Show"}
                </button>
                {confirmDelete === p.slug ? (
                  <span className="flex items-center gap-3">
                    <button
                      onClick={() => run({ action: "product-delete", slug: p.slug }, () => setConfirmDelete(null))}
                      className="label text-[10px] text-[#8a3a2a]"
                    >
                      Confirm delete
                    </button>
                    <button onClick={() => setConfirmDelete(null)} className="label text-[10px] text-umber">
                      Keep
                    </button>
                  </span>
                ) : (
                  <button onClick={() => setConfirmDelete(p.slug)} className="label text-[10px] text-umber hover:text-[#8a3a2a]">
                    Delete
                  </button>
                )}
              </div>
            </div>
            {editing === p.slug && (
              <div className="border-t hairline bg-bone/40 p-8">
                <ProductForm
                  initial={toForm(p)}
                  submitLabel="Save changes"
                  busy={busy}
                  onSubmit={(f) => run({ action: "product-update", slug: p.slug, patch: fromForm(f) }, () => setEditing(null))}
                  onCancel={() => setEditing(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
