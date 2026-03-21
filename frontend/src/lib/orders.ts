export type OrderItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  total: number;
  items: OrderItem[];
  metadata?: Record<string, any>;
};

const STORAGE_KEY = 'orders';

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch (err) {
    console.error('getOrders: parse error', err);
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('saveOrders: write error', err);
  }
}

/**
Add an order and return the new orders array.
New orders are prepended so newest appear first. */
export function addOrder(order: Order): Order[] {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return orders;
}
/** Remove an order by id */
export function removeOrder(orderId: string): Order[] {
  const orders = getOrders().filter((o) => o.id !== orderId);
  saveOrders(orders);
  return orders;
}

/** Clear all stored orders (dev helper) */
export function clearOrders() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('clearOrders error', err);
  }
}
