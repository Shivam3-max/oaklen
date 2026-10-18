// Line icons for the eight workshop steps.
//
// Drawn here rather than pulled from an icon set: the site already has a
// hand-drawn line language in Plate.tsx, and an off-the-shelf set sits
// awkwardly beside it. Same stroke weight and rounded caps, so the icons read
// as part of the same hand.
export type ProcessIconKind =
  | "cutting" | "frame" | "chair" | "carcass"
  | "assembly" | "springs" | "foam" | "finishing";

export default function ProcessIcon({
  kind,
  className = "",
}: {
  kind: ProcessIconKind;
  className?: string;
}) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g {...s}>
        {kind === "cutting" && (
          <>
            {/* a board on the table, blade rising through it */}
            <path d="M3 21 h26" />
            <path d="M7 21 v4 M25 21 v4" />
            <path d="M5 17 h22" />
            <path d="M16 17 v-9" />
            <path d="M13 11 q3 -4 6 0" />
            <path d="M12.5 14 l7 0" />
          </>
        )}
        {kind === "frame" && (
          <>
            {/* a sofa frame: rails and uprights */}
            <path d="M5 8 h22 v16 h-22 z" />
            <path d="M5 14 h22" />
            <path d="M12 8 v16 M20 8 v16" />
          </>
        )}
        {kind === "chair" && (
          <>
            <path d="M11 5 q-2 9 0 13 h11" />
            <path d="M11 18 v9 M22 18 v9" />
            <path d="M11 9 q6 -2 10 0" />
            <path d="M22 18 q2 -7 1 -12" />
          </>
        )}
        {kind === "carcass" && (
          <>
            {/* a cabinet carcass, one shelf, one door line */}
            <path d="M5 7 h22 v18 h-22 z" />
            <path d="M5 16 h22" />
            <path d="M16 16 v9" />
            <path d="M13 20.5 h2" />
          </>
        )}
        {kind === "assembly" && (
          <>
            {/* two members meeting at a joint, with the peg */}
            <path d="M4 19 h12 v-12" />
            <path d="M16 7 h12" />
            <path d="M16 19 h12" />
            <circle cx="16" cy="13" r="2" />
            <path d="M4 19 v5 M28 19 v5" />
          </>
        )}
        {kind === "springs" && (
          <>
            {/* serpentine springs across a rail */}
            <path d="M4 9 h24 M4 25 h24" />
            <path d="M8 9 v3 l4 2 l-4 2 l4 2 l-4 2 v5" />
            <path d="M16 9 v3 l4 2 l-4 2 l4 2 l-4 2 v5" />
            <path d="M24 9 v16" />
          </>
        )}
        {kind === "foam" && (
          <>
            {/* stacked cushion layers */}
            <path d="M4 20 q12 -4 24 0 v4 q-12 4 -24 0 z" />
            <path d="M5 16 q11 -3.5 22 0" />
            <path d="M6 12 q10 -3 20 0" />
            <path d="M7.5 8.5 q8.5 -2.5 17 0" />
          </>
        )}
        {kind === "finishing" && (
          <>
            {/* brush, and the checked surface below it */}
            <path d="M18 4 l6 6 l-9 9 l-6 -6 z" />
            <path d="M12 13 l6 6" />
            <path d="M4 27 h24" />
            <path d="M7 23 l2.5 2.5 l5 -5" />
          </>
        )}
      </g>
    </svg>
  );
}
