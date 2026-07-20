"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("oaklen-cookie-consent")) setShow(true);
    } catch {
      /* private mode — just don't show */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem("oaklen-cookie-consent", "1");
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] border-t hairline bg-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-12">
        <p className="max-w-2xl text-[13px] leading-relaxed text-umber">
          We use a few cookies to keep your cart working. See our{" "}
          <Link href="/policies/privacy" className="text-brass underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
        <button onClick={dismiss} className="btn-line !py-2.5 !text-[10px]">
          Got it
        </button>
      </div>
    </div>
  );
}
