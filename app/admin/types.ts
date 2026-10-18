import type { StoredProduct, StoredProject, Order, Enquiry, Subscriber } from "@/lib/store";

export type { StoredProduct, StoredProject, Order, Enquiry, Subscriber };

export interface AdminData {
  orders: Order[];
  products: StoredProduct[];
  projects: StoredProject[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  siteImages?: Record<string, string>;
  dbConnected?: boolean;
}

export type Act = (body: Record<string, unknown>) => Promise<string | null>;

export const STATUS_LABEL: Record<string, string> = { new: "New", "in-atelier": "In the atelier", delivered: "Delivered" };
