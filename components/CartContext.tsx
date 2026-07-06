"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

export interface CartLine {
  slug: string;
  qty: number;
  fabric?: string;
}

interface CartCtx {
  lines: CartLine[];
  add: (slug: string, fabric?: string) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  product: (slug: string) => Product | undefined;
  productsReady: boolean;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [catalog, setCatalog] = useState<Map<string, Product>>(new Map());
  const [productsReady, setProductsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oaklen-cart");
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setCatalog(new Map((d.products as Product[]).map((p) => [p.slug, p])));
        setProductsReady(true);
      })
      .catch(() => setProductsReady(true));
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("oaklen-cart", JSON.stringify(lines));
  }, [lines, ready]);

  const api = useMemo<CartCtx>(() => {
    const subtotal = lines.reduce((sum, l) => {
      const p = catalog.get(l.slug);
      return sum + (p ? p.price * l.qty : 0);
    }, 0);
    return {
      lines,
      add: (slug, fabric) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.slug === slug && l.fabric === fabric);
          if (hit) return prev.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l));
          return [...prev, { slug, qty: 1, fabric }];
        }),
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      setQty: (slug, qty) =>
        setLines((prev) =>
          qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))
        ),
      clear: () => setLines([]),
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      product: (slug) => catalog.get(slug),
      productsReady,
    };
  }, [lines, catalog, productsReady]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
