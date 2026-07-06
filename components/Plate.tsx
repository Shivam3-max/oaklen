import type { Silhouette } from "@/data/products";

type PlateKind = Silhouette | "room" | "craft" | "workshop" | "portrait" | "detail" | "swatchkit";

const TONES = ["#EFEAE3", "#E8E2D8", "#E3D9C8", "#EDE7DC", "#E6DECF"];

const STROKE = "rgba(43,33,23,0.34)";
const FAINT = "rgba(43,33,23,0.16)";

function Art({ kind }: { kind: PlateKind }) {
  const s = { fill: "none", stroke: STROKE, strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const f = { ...s, stroke: FAINT };
  switch (kind) {
    case "sofa":
      return (
        <g {...s}>
          <path d="M20 62 h120 M24 62 v10 M136 62 v10" />
          <path d="M28 62 V40 q0 -6 6 -6 h92 q6 0 6 6 v22" />
          <path d="M28 50 q-8 0 -8 8 v4 M132 50 q8 0 8 8 v4" />
          <path d="M36 62 v-14 q0 -4 4 -4 h34 q4 0 4 4 v14 M82 62 v-14 q0 -4 4 -4 h34 q4 0 4 4 v14" />
          <path d="M20 68 h120" {...f} />
        </g>
      );
    case "sofa-curved":
      return (
        <g {...s}>
          <path d="M18 66 q62 14 124 0" />
          <path d="M24 64 Q30 34 50 32 h60 Q130 34 136 64" />
          <path d="M40 60 q40 10 80 0" {...f} />
          <path d="M34 46 q46 12 92 0" {...f} />
        </g>
      );
    case "sofa-chester":
      return (
        <g {...s}>
          <path d="M22 64 h116 M28 64 v8 M132 64 v8" />
          <path d="M30 64 V36 q0 -8 8 -8 h84 q8 0 8 8 v28" />
          <path d="M30 50 q-8 2 -7 10 M130 50 q8 2 7 10" />
          <g {...f}>
            <circle cx="52" cy="40" r="1.4" /><circle cx="68" cy="40" r="1.4" /><circle cx="84" cy="40" r="1.4" /><circle cx="100" cy="40" r="1.4" />
            <circle cx="60" cy="48" r="1.4" /><circle cx="76" cy="48" r="1.4" /><circle cx="92" cy="48" r="1.4" />
          </g>
        </g>
      );
    case "sectional":
      return (
        <g {...s}>
          <path d="M20 60 h84 v10 h-84 z" />
          <path d="M104 30 h24 v40 h-24" />
          <path d="M20 60 v-20 q0 -6 6 -6 h78" />
          <path d="M104 30 q0 -6 6 -6 h12 q6 0 6 6" />
          <path d="M46 60 v-16 M72 60 v-16" {...f} />
        </g>
      );
    case "armchair":
      return (
        <g {...s}>
          <path d="M48 66 h64 M54 66 v8 M106 66 v8" />
          <path d="M56 66 V36 q0 -8 8 -8 h32 q8 0 8 8 v30" />
          <path d="M56 48 q-10 0 -9 10 M104 48 q10 0 9 10" />
          <path d="M62 56 h36" {...f} />
        </g>
      );
    case "bed":
      return (
        <g {...s}>
          <path d="M26 70 h108 M30 70 v6 M130 70 v6" />
          <path d="M32 70 V34 q0 -6 6 -6 h20" />
          <path d="M32 52 h102 v18" />
          <path d="M40 52 v-8 q0 -4 4 -4 h18 q4 0 4 4 v8" {...f} />
          <path d="M32 60 h102" {...f} />
        </g>
      );
    case "bed-canopy":
      return (
        <g {...s}>
          <path d="M30 76 V22 M130 76 V22 M30 22 h100" />
          <path d="M30 58 h100 M30 66 h100 v10" />
          <path d="M38 58 v-12 q0 -4 4 -4 h16 q4 0 4 4 v12" {...f} />
          <path d="M30 26 q8 10 0 20 M130 26 q-8 10 0 20" {...f} />
        </g>
      );
    case "bed-platform":
      return (
        <g {...s}>
          <path d="M22 62 h116 v8 h-116 z" />
          <path d="M30 62 v-6 h84 v6" />
          <path d="M30 70 v6 M130 70 v6" />
          <path d="M38 56 v-4 h20 v4" {...f} />
        </g>
      );
    case "dining":
      return (
        <g {...s}>
          <path d="M22 42 h116" />
          <path d="M30 42 v32 M130 42 v32" />
          <path d="M22 46 h116" {...f} />
          <path d="M52 46 v20 M108 46 v20" {...f} />
          <path d="M64 56 h32" {...f} />
        </g>
      );
    case "dining-round":
      return (
        <g {...s}>
          <ellipse cx="80" cy="42" rx="52" ry="9" />
          <path d="M80 51 v18" />
          <path d="M62 74 q18 -8 36 0" />
          <path d="M80 58 q-14 2 -20 10 M80 58 q14 2 20 10" {...f} />
        </g>
      );
    case "chair":
      return (
        <g {...s}>
          <path d="M64 22 q-4 24 0 34 h30" />
          <path d="M64 56 v22 M94 56 v22" />
          <path d="M64 26 q16 -4 28 0" {...f} />
          <path d="M64 40 q16 -4 28 0" {...f} />
          <path d="M94 56 q4 -18 2 -30" {...f} />
        </g>
      );
    case "centre":
      return (
        <g {...s}>
          <path d="M36 52 q44 -14 88 0 q-8 10 -44 10 t-44 -10 z" />
          <path d="M56 60 v12 M104 60 v12" />
        </g>
      );
    case "centre-marble":
      return (
        <g {...s}>
          <rect x="34" y="44" width="92" height="7" />
          <path d="M46 51 l-8 22 M114 51 l8 22 M56 51 l24 22 M104 51 l-24 22" />
          <path d="M44 46 q10 3 20 0 q10 -3 18 1 q12 3 20 -1" {...f} />
        </g>
      );
    case "nesting":
      return (
        <g {...s}>
          <path d="M28 46 h44 M32 46 v28 M68 46 v28" />
          <path d="M66 54 h38 M70 54 v20 M100 54 v20" />
          <path d="M98 62 h32 M102 62 v12 M126 62 v12" />
        </g>
      );
    case "pillow":
      return (
        <g {...s}>
          <path d="M40 34 q40 -8 80 0 q6 16 0 32 q-40 8 -80 0 q-6 -16 0 -32 z" />
          <path d="M40 34 l-6 -5 M120 34 l6 -5 M40 66 l-6 5 M120 66 l6 5" />
          <path d="M52 42 q28 -5 56 0" {...f} />
        </g>
      );
    case "throw":
      return (
        <g {...s}>
          <path d="M40 28 q6 14 -2 24 q10 12 2 26 h76 q-8 -14 2 -26 q-8 -10 -2 -24 z" />
          <path d="M52 36 h56 M50 50 h60 M52 64 h56" {...f} />
          <path d="M44 78 v6 M60 78 v6 M76 78 v6 M92 78 v6 M108 78 v6" {...f} />
        </g>
      );
    case "room":
      return (
        <g {...s}>
          <path d="M14 74 h132" />
          <path d="M22 74 v-6 h52 v6 M26 68 v-14 q0 -4 4 -4 h36 q4 0 4 4 v14" />
          <path d="M92 74 v-10 q14 -6 28 0 v10" />
          <path d="M118 30 v22 M108 52 h20" {...f} />
          <path d="M30 30 h28 v14 h-28 z" {...f} />
          <circle cx="141" cy="40" r="5" {...f} />
          <path d="M141 45 v29" {...f} />
        </g>
      );
    case "craft":
      return (
        <g {...s}>
          <path d="M34 66 q22 -34 46 -38 q20 -3 28 10 q6 12 -6 18 q-30 14 -68 10 z" />
          <path d="M58 62 q14 -22 34 -28" {...f} />
          <path d="M96 34 l12 -12 M104 42 l14 -10" {...f} />
        </g>
      );
    case "workshop":
      return (
        <g {...s}>
          <path d="M20 72 h120" />
          <path d="M32 72 V44 h40 v28 M32 52 h40" />
          <path d="M88 72 V38 l16 -12 16 12 v34" />
          <path d="M96 72 v-16 h16 v16" {...f} />
          <path d="M40 44 v-8 h10" {...f} />
        </g>
      );
    case "portrait":
      return (
        <g {...s}>
          <circle cx="80" cy="38" r="14" />
          <path d="M52 78 q4 -24 28 -24 t28 24" />
          <path d="M70 34 q10 -6 20 0" {...f} />
        </g>
      );
    case "detail":
      return (
        <g {...s}>
          <path d="M30 70 q20 -46 50 -46 t50 46" />
          <path d="M42 70 q16 -34 38 -34 t38 34" {...f} />
          <path d="M56 70 q10 -22 24 -22 t24 22" {...f} />
        </g>
      );
    case "swatchkit":
      return (
        <g {...s}>
          <rect x="34" y="30" width="34" height="44" />
          <rect x="58" y="26" width="34" height="44" />
          <rect x="82" y="22" width="34" height="44" />
          <circle cx="110" cy="28" r="2.5" {...f} />
          <path d="M40 62 h22 M64 58 h22" {...f} />
        </g>
      );
    default:
      return null;
  }
}

export default function Plate({
  kind,
  label,
  plate,
  ratio = "4/5",
  toneIndex = 0,
  className = "",
  bare = false,
}: {
  kind: PlateKind;
  label?: string;
  plate?: number | string;
  ratio?: string;
  toneIndex?: number;
  className?: string;
  bare?: boolean;
}) {
  const tone = TONES[toneIndex % TONES.length];
  return (
    <div
      className={`grain relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio, background: tone }}
    >
      <svg
        viewBox="0 0 160 96"
        className="absolute left-1/2 top-1/2 w-[62%] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <Art kind={kind} />
      </svg>
      {!bare && (
        <>
          <span className="tick left-3 top-3 border-l border-t" />
          <span className="tick right-3 top-3 border-r border-t" />
          <span className="tick bottom-3 left-3 border-b border-l" />
          <span className="tick bottom-3 right-3 border-b border-r" />
          {(plate !== undefined || label) && (
            <div className="absolute bottom-4 left-4 z-[2] flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-brass" />
              <span className="label text-[10px] text-umber">
                {plate !== undefined ? `PL. ${String(plate).padStart(2, "0")}` : ""}
                {plate !== undefined && label ? " — " : ""}
                {label ?? ""}
              </span>
            </div>
          )}
          <span className="label absolute right-4 top-4 z-[2] text-[9px] text-umber/60">
            Photograph forthcoming
          </span>
        </>
      )}
    </div>
  );
}
