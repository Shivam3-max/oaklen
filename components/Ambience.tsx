type Variant = "cream" | "mist" | "sage" | "shadow";

// The background layer for a section. Three states, in the order the
// reference boutiques use them:
//   • a photograph has been uploaded  → it sits here far out of focus, so the
//     band is genuinely photographic without the image fighting the type
//   • no photograph                    → a tonal radial field in the palette
//   • `parallax`                       → the field is fixed to the viewport and
//     drifts against the scroll (holzer.in does this on two of its bands)
// Either way the section never renders as a flat panel.
export default function Ambience({
  src,
  variant = "cream",
  parallax = false,
  feather = true,
  className = "",
}: {
  src?: string | null;
  variant?: Variant;
  parallax?: boolean;
  feather?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`amb grain amb-${variant} ${parallax && !src ? "amb-fixed" : ""} ${className}`}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="amb-photo" />
          <div className="amb-tint" />
        </>
      ) : (
        <div className="amb-field" />
      )}
      {feather && <div className="amb-feather" />}
    </div>
  );
}
