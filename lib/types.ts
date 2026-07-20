import type { Product } from "@/data/products";

export interface OrderItem {
  slug: string;
  name: string;
  line: string;
  qty: number;
  price: number;
  fabric?: string;
}

// A "booking" — the customer reserves pieces by giving contact details.
// No payment is taken on the site; the concierge follows up.
export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  customer: { name: string; phone: string; email: string; address: string; pin: string };
  note?: string;
  status: "new" | "in-atelier" | "delivered";
  createdAt: string;
}

export interface StoredProduct extends Product {
  active: boolean;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  kind: "consultation" | "swatch-kit" | "reward";
  name: string;
  phone: string;
  note?: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface Subscriber {
  email: string;
  createdAt: string;
}

export type SiteImageMap = Record<string, string>;

export interface StoreImpl {
  getSiteImages(): Promise<SiteImageMap>;
  setSiteImage(key: string, url: string): Promise<boolean>;
  clearSiteImage(key: string): Promise<boolean>;
  listProducts(includeInactive?: boolean): Promise<StoredProduct[]>;
  getStoredProduct(slug: string): Promise<StoredProduct | null>;
  createProduct(input: Omit<Product, "slug" | "plate">): Promise<StoredProduct>;
  updateProduct(slug: string, patch: Partial<Omit<StoredProduct, "slug" | "createdAt">>): Promise<StoredProduct | null>;
  deleteProduct(slug: string): Promise<boolean>;
  createOrder(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  ordersByPhone(phone: string): Promise<Order[]>;
  listOrders(): Promise<Order[]>;
  setOrderStatus(id: string, status: Order["status"]): Promise<Order | null>;
  createEnquiry(input: { kind: Enquiry["kind"]; name: string; phone: string; note?: string }): Promise<Enquiry>;
  listEnquiries(): Promise<Enquiry[]>;
  setEnquiryStatus(id: string, status: Enquiry["status"]): Promise<Enquiry | null>;
  addSubscriber(email: string): Promise<boolean>;
  listSubscribers(): Promise<Subscriber[]>;
}
