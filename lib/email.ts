import { BRAND, addressLine } from "@/data/brand";
import type { Order } from "./types";

// Email is optional: without RESEND_API_KEY set, these no-op (and log in dev)
// so the site still runs. Set RESEND_API_KEY + EMAIL_FROM to switch on email.

const FROM = process.env.EMAIL_FROM || `Oaklen <onboarding@resend.dev>`;
const STAFF = process.env.EMAIL_STAFF || BRAND.email;

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

async function send(to: string | string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject=${subject}`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) console.error("Resend error:", await res.text());
    return res.ok;
  } catch (e) {
    console.error("Email send failed:", e);
    return false;
  }
}

function shell(body: string) {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#2B2117;background:#F7F4EF;padding:32px">
    <div style="letter-spacing:6px;font-size:14px;color:#2B2117">OAKLEN</div>
    <div style="height:1px;background:rgba(43,33,23,0.14);margin:20px 0"></div>
    ${body}
    <div style="height:1px;background:rgba(43,33,23,0.14);margin:24px 0"></div>
    <div style="font-size:12px;color:#6B5E4E;line-height:1.6">${BRAND.legalName} · ${addressLine}<br/>${BRAND.phoneDisplay} · ${BRAND.email}</div>
  </div>`;
}

function itemRows(order: Order) {
  return order.items
    .map((it) => `<tr><td style="padding:6px 0">${it.name} — ${it.line} × ${it.qty}${it.fabric ? ` · ${it.fabric}` : ""}</td><td style="padding:6px 0;text-align:right">${formatINR(it.price * it.qty)}</td></tr>`)
    .join("");
}

export async function sendOrderConfirmation(order: Order) {
  if (!order.customer.email) return false;
  const body = `
    <p style="font-size:20px;margin:0 0 16px">We’ve got your booking, ${order.customer.name.split(" ")[0]}.</p>
    <p style="font-size:14px;line-height:1.7;color:#6B5E4E;margin:0 0 20px">Thank you for booking <strong>${order.id}</strong>. Our team will call you shortly to confirm the details and arrange delivery — there’s nothing more to pay online.</p>
    <table style="width:100%;font-size:14px;border-collapse:collapse">${itemRows(order)}
      <tr><td style="padding-top:12px;border-top:1px solid rgba(43,33,23,0.14)">Total</td><td style="padding-top:12px;border-top:1px solid rgba(43,33,23,0.14);text-align:right">${formatINR(order.subtotal)}</td></tr>
    </table>
    <p style="font-size:13px;color:#6B5E4E;margin-top:20px">Delivering to: ${order.customer.address}, ${order.customer.pin}</p>`;
  return send(order.customer.email, `Your Oaklen booking ${order.id}`, shell(body));
}

export async function sendStaffOrderAlert(order: Order) {
  const body = `
    <p style="font-size:18px;margin:0 0 12px">New booking — ${order.id}</p>
    <table style="width:100%;font-size:14px;border-collapse:collapse">${itemRows(order)}
      <tr><td style="padding-top:12px;border-top:1px solid rgba(43,33,23,0.14)">Total</td><td style="padding-top:12px;border-top:1px solid rgba(43,33,23,0.14);text-align:right">${formatINR(order.subtotal)}</td></tr>
    </table>
    <p style="font-size:13px;color:#6B5E4E;margin-top:16px">${order.customer.name} · ${order.customer.phone} · ${order.customer.email || "no email"}<br/>${order.customer.address}, ${order.customer.pin}${order.note ? `<br/>Note: ${order.note}` : ""}</p>`;
  return send(STAFF, `New Oaklen booking ${order.id} — ${formatINR(order.subtotal)}`, shell(body));
}

export async function sendEnquiryAlert(kind: string, name: string, phone: string, note?: string) {
  const label = kind === "swatch-kit" ? "swatch kit request" : kind === "reward" ? "rewards sign-up" : "consultation enquiry";
  const body = `
    <p style="font-size:18px;margin:0 0 12px">New ${label}</p>
    <p style="font-size:14px;line-height:1.7">${name}<br/>${phone}${note ? `<br/><em style="color:#6B5E4E">“${note}”</em>` : ""}</p>`;
  return send(STAFF, `New Oaklen ${label} — ${name}`, shell(body));
}
