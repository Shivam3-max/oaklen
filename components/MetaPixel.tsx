"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, trackMeta } from "@/lib/metaPixel";

// Loads the Meta Pixel, sends a PageView on every in-app navigation, and
// reports WhatsApp and phone taps as Contact events site-wide.
export default function MetaPixel() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  useEffect(() => {
    // The first PageView is sent by the init script below.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackMeta("PageView");
  }, [pathname]);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.includes("wa.me/")) trackMeta("Contact", { content_name: "WhatsApp" });
      else if (href.startsWith("tel:")) trackMeta("Contact", { content_name: "Phone" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!META_PIXEL_ID) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}
