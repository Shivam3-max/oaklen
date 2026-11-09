// Meta Pixel helpers. The id is public (it ships in every page), so production
// defaults to Oaklen's real pixel and needs no host configuration. Outside
// production it stays off unless NEXT_PUBLIC_META_PIXEL_ID is set, so local
// development never sends events to the real pixel.
export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  (process.env.NODE_ENV === "production" ? "890693117031000" : "");

type Fbq = (command: "track" | "init", event: string, params?: Record<string, unknown>) => void;

export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window as unknown as { fbq?: Fbq }).fbq?.("track", event, params);
}
