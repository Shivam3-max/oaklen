import crypto from "crypto";

// Razorpay is optional: if keys aren't set (demo/preview), the checkout falls
// back to recording the order without charging. Set RAZORPAY_KEY_ID and
// RAZORPAY_KEY_SECRET in the environment to switch on real payments.

export function isRazorpayConfigured() {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function razorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID ?? "";
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

// Creates an order via the Razorpay REST API. Amount is in paise.
export async function createRazorpayOrder(amountInr: number, receipt: string): Promise<RazorpayOrder> {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Math.round(amountInr * 100),
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order failed: ${text}`);
  }
  return res.json();
}

// Verifies the signature Razorpay returns to the browser after a successful payment.
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// Verifies an incoming webhook against the webhook secret.
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

// Issues a refund for a captured payment. Amount optional (full refund if omitted).
export async function refundPayment(paymentId: string, amountInr?: number) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(amountInr ? { amount: Math.round(amountInr * 100) } : {}),
  });
  if (!res.ok) throw new Error(`Refund failed: ${await res.text()}`);
  return res.json();
}
