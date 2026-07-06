"use client";

import { useRef, useState } from "react";

interface PieceDef {
  id: string;
  label: string;
  w: number;
  d: number;
}

const PIECES: PieceDef[] = [
  { id: "aria", label: "Aria sofa", w: 220, d: 95 },
  { id: "meridian", label: "Meridian L", w: 320, d: 240 },
  { id: "pebble", label: "Pebble table", w: 110, d: 70 },
  { id: "cove", label: "Cove chair", w: 88, d: 84 },
  { id: "longford", label: "Longford table", w: 240, d: 100 },
  { id: "nocturne", label: "Nocturne bed", w: 193, d: 203 },
];

interface Placed extends PieceDef {
  key: number;
  x: number;
  y: number;
}

export default function RoomFit() {
  const [roomW, setRoomW] = useState(420);
  const [roomD, setRoomD] = useState(360);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const floorRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ key: number; dx: number; dy: number } | null>(null);

  const scale = 560 / Math.max(roomW, 200);
  const floorPxW = roomW * scale;
  const floorPxH = roomD * scale;

  const addPiece = (p: PieceDef) => {
    if (p.w > roomW || p.d > roomD) return;
    setPlaced([...placed, { ...p, key: nextKey, x: 10, y: 10 }]);
    setNextKey(nextKey + 1);
  };

  const onPointerDown = (e: React.PointerEvent, key: number) => {
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    drag.current = { key, dx: e.clientX - rect.left, dy: e.clientY - rect.top };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !floorRef.current) return;
    const floor = floorRef.current.getBoundingClientRect();
    const { key, dx, dy } = drag.current;
    setPlaced((prev) =>
      prev.map((p) => {
        if (p.key !== key) return p;
        const pw = p.w * scale;
        const ph = p.d * scale;
        const x = Math.min(Math.max(e.clientX - floor.left - dx, 0), floor.width - pw);
        const y = Math.min(Math.max(e.clientY - floor.top - dy, 0), floor.height - ph);
        return { ...p, x, y };
      })
    );
  };

  const usedArea = placed.reduce((s, p) => s + p.w * p.d, 0);
  const density = Math.round((usedArea / (roomW * roomD)) * 100);

  return (
    <div className="mx-auto max-w-[1500px] px-6 pb-28 pt-36 lg:px-12">
      <p className="label mb-4 text-brass">Tool 02 — The floor plan</p>
      <h1 className="serif-display text-6xl lg:text-7xl">Will it fit?</h1>
      <p className="mt-4 max-w-lg text-sm text-umber">
        Set your room in centimetres, add pieces at true scale, drag them into place. A calm room stays under 40% floor coverage.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[auto_1fr]">
        <div className="w-full max-w-xs space-y-8">
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="label text-[10px] text-umber">Room width</span><span>{roomW} cm</span>
            </div>
            <input type="range" min={250} max={800} step={10} value={roomW} onChange={(e) => setRoomW(+e.target.value)} />
            <div className="mb-2 mt-6 flex justify-between text-sm">
              <span className="label text-[10px] text-umber">Room depth</span><span>{roomD} cm</span>
            </div>
            <input type="range" min={250} max={800} step={10} value={roomD} onChange={(e) => setRoomD(+e.target.value)} />
          </div>
          <div>
            <p className="label mb-4 text-[10px] text-umber">Add a piece</p>
            <div className="flex flex-wrap gap-2">
              {PIECES.map((p) => {
                const fits = p.w <= roomW && p.d <= roomD;
                return (
                  <button
                    key={p.id}
                    onClick={() => addPiece(p)}
                    disabled={!fits}
                    className={`border px-3.5 py-2.5 text-xs transition-all ${fits ? "hairline hover:border-brass hover:text-brass" : "hairline opacity-30"}`}
                  >
                    {p.label} · {p.w}×{p.d}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="border hairline bg-bone/50 p-6">
            <p className="label text-[10px] text-umber">Floor coverage</p>
            <p className="serif-display mt-1 text-5xl">{density}%</p>
            <p className="mt-2 text-xs text-umber">
              {density === 0 ? "Empty floor — add a piece." : density <= 40 ? "Breathing room. This is the atelier's sweet spot." : density <= 55 ? "Cosy. Consider one piece fewer." : "Crowded — the room will feel smaller than it is."}
            </p>
            {placed.length > 0 && (
              <button onClick={() => setPlaced([])} className="label mt-4 text-[9px] text-umber underline underline-offset-4 hover:text-brass">
                Clear the floor
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            ref={floorRef}
            onPointerMove={onPointerMove}
            onPointerUp={() => (drag.current = null)}
            className="grain relative border hairline bg-parchment"
            style={{
              width: floorPxW,
              height: floorPxH,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(43,33,23,0.05) 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, rgba(43,33,23,0.05) 0 1px, transparent 1px 100%)",
              backgroundSize: `${50 * scale}px ${50 * scale}px`,
            }}
          >
            <span className="label absolute -top-6 left-0 text-[9px] text-umber">{roomW} cm</span>
            <span className="label absolute -left-2 top-0 origin-top-left -rotate-90 text-[9px] text-umber" style={{ transform: "rotate(-90deg) translateX(-100%)" }}>
              {roomD} cm
            </span>
            {placed.map((p) => (
              <div
                key={p.key}
                onPointerDown={(e) => onPointerDown(e, p.key)}
                className="absolute flex cursor-grab touch-none items-center justify-center border border-espresso/40 bg-clay/50 active:cursor-grabbing active:border-brass"
                style={{ left: p.x, top: p.y, width: p.w * scale, height: p.d * scale }}
              >
                <span className="label pointer-events-none px-1 text-center text-[8px] leading-tight text-espresso/70">{p.label}</span>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setPlaced(placed.filter((x) => x.key !== p.key))}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border hairline bg-ivory text-[10px] text-umber hover:text-brass"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
