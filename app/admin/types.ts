import type { StoredProduct, Order, Partner, Enquiry, Subscriber } from "@/lib/store";

export type { StoredProduct, Order, Partner, Enquiry, Subscriber };

export interface AdminData {
  orders: Order[];
  partners: Partner[];
  products: StoredProduct[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
}

export type Act = (body: Record<string, unknown>) => Promise<string | null>;

export const TIER_LABEL: Record<string, string> = { trade: "Trade", build: "Build", circle: "Circle" };
export const STATUS_LABEL: Record<string, string> = { reserved: "Reserved", "in-atelier": "In the atelier", delivered: "Delivered" };
