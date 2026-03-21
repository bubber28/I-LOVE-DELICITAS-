export interface Order {
  id: string
  items: any[]
  total: number
  status: string
  created_at: string
  customer_name?: string
  customer_phone?: string
}

export function getOrders(): Order[] {
  const orders = localStorage.getItem('orders')
  return orders ? JSON.parse(orders) : []
}

export function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const orders = getOrders()
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  orders.push(newOrder)
  localStorage.setItem('orders', JSON.stringify(orders))
  return newOrder
}
