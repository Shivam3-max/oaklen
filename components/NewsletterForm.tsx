"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const subscribe = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return <p className="font-serif text-lg italic text-walnut">You&apos;re in the ledger. First note next month.</p>;
  }

  return (
    <div>
      <form
        className="flex max-w-sm items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          subscribe();
        }}
      >
        <input
          placeholder="you@address.com"
          aria-label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="label whitespace-nowrap border-b border-espresso pb-2.5 transition-colors hover:text-brass">
          {state === "busy" ? "…" : "Subscribe"}
        </button>
      </form>
      {state === "error" && <p className="mt-2 text-xs text-[#8a3a2a]">Enter a valid email.</p>}
    </div>
  );
}
