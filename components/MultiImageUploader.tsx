"use client";

import { useRef, useState } from "react";

// Resizes a file to the target box (cover-fit) and returns a compressed JPEG
// data URL — same approach as ImageUploader, kept small for DB storage.
function resizeToDataUrl(file: File, targetW: number, targetH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (targetW - dw) / 2, (targetH - dh) / 2, dw, dh);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => reject(new Error("bad image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

export default function MultiImageUploader({
  images,
  onChange,
  width,
  height,
  max,
}: {
  images: string[];
  onChange: (next: string[]) => void;
  width: number;
  height: number;
  max: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setError(null);
    setBusy(true);
    const room = max - images.length;
    const chosen = files.slice(0, Math.max(0, room));
    try {
      const added: string[] = [];
      for (const f of chosen) {
        if (!f.type.startsWith("image/")) continue;
        added.push(await resizeToDataUrl(f, width, height));
      }
      onChange([...images, ...added].slice(0, max));
      if (files.length > room) setError(`Only ${max} images allowed — extra files were skipped.`);
    } catch {
      setError("Couldn’t read one of those images. Try another.");
    }
    setBusy(false);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative w-24">
            <div className="relative overflow-hidden border hairline bg-bone/50" style={{ aspectRatio: "5/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="label absolute left-1 top-1 bg-espresso px-1.5 py-0.5 text-[8px] text-ivory">Cover</span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="label text-[10px] text-umber disabled:opacity-30 hover:text-brass" aria-label="Move left">←</button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === images.length - 1} className="label text-[10px] text-umber disabled:opacity-30 hover:text-brass" aria-label="Move right">→</button>
              </div>
              <button type="button" onClick={() => onChange(images.filter((_, x) => x !== i))} className="label text-[10px] text-umber hover:text-[#8a3a2a]">Remove</button>
            </div>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex w-24 items-center justify-center border border-dashed hairline text-center disabled:opacity-50"
            style={{ aspectRatio: "5/4" }}
          >
            <span className="label text-[9px] text-umber">{busy ? "…" : "+ Add"}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
      <p className="label mt-2 text-[9px] text-umber">
        Up to {max} photos · recommended {width} × {height} px · first is the cover · drag order with ← →
      </p>
      {error && <p className="mt-1 text-[10px] text-[#8a3a2a]">{error}</p>}
    </div>
  );
}
