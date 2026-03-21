export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url?: string
  cores?: string[]
  tamanhos?: string[]
}

export function getCart(): CartItem[] {
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function addToCart(item: CartItem) {
  const cart = getCart()
  const existing = cart.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    cart.push(item)
  }
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const cart = getCart()
  const item = cart.find(i => i.id === id)
  if (item) {
    item.quantity = quantity
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }
}

export function removeFromCart(id: string) {
  const cart = getCart()
  const newCart = cart.filter(i => i.id !== id)
  localStorage.setItem('cart', JSON.stringify(newCart))
}

export function clearCart() {
  localStorage.removeItem('cart')
}
