// Utilitário simples de carrinho usando localStorage

export type CartProduct = {
  id: string;
  nome: string;
  preco: number;
  qty: number;
};

const CART_KEY = 'cart';

export function getCart(): CartProduct[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(cart: CartProduct[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Omit<CartProduct, 'qty'>) {
  const cart = getCart();
  const idx = cart.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  setCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter(p => p.id !== productId);
  setCart(cart);
}

export function updateQty(productId: string, qty: number) {
  if (qty < 1) return;
  const cart = getCart().map(p =>
    p.id === productId ? { ...p, qty } : p
  );
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}
