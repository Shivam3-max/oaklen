"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { IMAGE_SLOTS } from "@/data/siteImages";
import type { AdminData, Act } from "../types";

export default function MediaTab({ data, act }: { data: AdminData; act: Act }) {
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const images = data.siteImages ?? {};

  const sections = Array.from(new Set(IMAGE_SLOTS.map((s) => s.section)));
  const filledCount = IMAGE_SLOTS.filter((s) => images[s.key]).length;

  const save = async (key: string, url: string | null) => {
    setSavingKey(key);
    setError(null);
    const err = await act(url ? { action: "site-image-set", key, url } : { action: "site-image-clear", key });
    if (err) setError(err);
    setSavingKey(null);
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y hairline py-4">
        <p className="label text-umber">
          {filledCount} of {IMAGE_SLOTS.length} sections have a photo · the rest show the designed placeholder
        </p>
        <p className="label text-[10px] text-umber">Uploads are resized automatically to the size shown</p>
      </div>

      {error && <p className="mt-4 text-xs text-[#8a3a2a]">{error}</p>}

      {sections.map((section) => (
        <div key={section} className="mt-10">
          <p className="label mb-6 text-brass">{section}</p>
          <div className="grid gap-8 sm:grid-cols-2">
            {IMAGE_SLOTS.filter((s) => s.section === section).map((slot) => (
              <div key={slot.key} className={`border hairline p-5 ${savingKey === slot.key ? "opacity-50" : ""}`}>
                <p className="font-serif text-lg">{slot.label}</p>
                {slot.note && <p className="mb-3 mt-0.5 text-xs text-umber">{slot.note}</p>}
                <div className="mt-3">
                  <ImageUploader
                    value={images[slot.key] ?? null}
                    width={slot.w}
                    height={slot.h}
                    ratio={`${slot.w}/${slot.h}`}
                    onChange={(url) => save(slot.key, url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
