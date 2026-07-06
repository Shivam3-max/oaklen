"use client";

import { useState } from "react";
import { formatINR } from "@/data/products";

export default function EmiCalculator() {
  const [amount, setAmount] = useState(168000);
  const [months, setMonths] = useState(12);

  const r = 0.14 / 12;
  const emi = Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  const total = emi * months;

  return (
    <div className="border hairline bg-bone/50 p-7">
      <div className="mb-7">
        <div className="mb-3 flex justify-between text-sm">
          <span className="label text-[10px] text-umber">Piece value</span>
          <span>{formatINR(amount)}</span>
        </div>
        <input type="range" min={10000} max={400000} step={2000} value={amount} onChange={(e) => setAmount(+e.target.value)} />
      </div>
      <div className="mb-8">
        <div className="mb-3 flex justify-between text-sm">
          <span className="label text-[10px] text-umber">Tenure</span>
          <span>{months} months</span>
        </div>
        <input type="range" min={3} max={24} step={3} value={months} onChange={(e) => setMonths(+e.target.value)} />
      </div>
      <div className="border-t hairline pt-6">
        <p className="label text-[10px] text-umber">Monthly</p>
        <p className="serif-display mt-1 text-5xl">{formatINR(emi)}</p>
        <p className="mt-3 text-xs text-umber">
          Total {formatINR(total)} at 14% p.a. reducing. No-cost EMI runs seasonally — the concierge will tell you honestly if waiting a month saves you money.
        </p>
      </div>
    </div>
  );
}
