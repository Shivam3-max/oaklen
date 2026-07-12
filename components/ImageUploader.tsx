"use client";

import { useRef, useState } from "react";

// Resizes the chosen file to the target box (cover-fit), returns a compressed
// JPEG data URL. Keeps uploads small enough to store directly in the database.
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
        // cover-fit: scale so the image fills the box, crop the overflow
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

export default function ImageUploader({
  value,
  onChange,
  width,
  height,
  ratio = "4/5",
  compact = false,
}: {
  value?: string | null;
  onChange: (dataUrl: string | null) => void;
  width: number;
  height: number;
  ratio?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG or PNG).");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await resizeToDataUrl(file, width, height);
      onChange(dataUrl);
    } catch {
      setError("Couldn’t read that image. Try another.");
    }
    setBusy(false);
  };

  return (
    <div className={compact ? "" : "flex items-start gap-5"}>
      <div className={compact ? "mb-3" : "w-32 shrink-0"}>
        <div className="relative overflow-hidden border hairline bg-bone/50" style={{ aspectRatio: ratio }}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="label absolute inset-0 flex items-center justify-center text-center text-[9px] text-umber/60">
              No image
            </span>
          )}
        </div>
      </div>
      <div className={compact ? "" : "flex-1"}>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={pick} disabled={busy} className="btn-line !py-2.5 !text-[10px] disabled:opacity-50">
            {busy ? "Processing…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button onClick={() => onChange(null)} className="label text-[10px] text-umber hover:text-[#8a3a2a]">
              Remove
            </button>
          )}
        </div>
        <p className="label mt-2 text-[9px] text-umber">
          Recommended {width} × {height} px · JPG or PNG · resized automatically
        </p>
        {error && <p className="mt-1 text-[10px] text-[#8a3a2a]">{error}</p>}
      </div>
    </div>
  );
}
