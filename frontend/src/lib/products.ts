import { supabase } from './supabase'

export interface Product {
  id: string
  name: string
  description: string
  price_cents: number
  stock: number
  active: boolean
  image_url?: string
  category_id?: string
  cores?: string[]
  tamanhos?: string[]
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
  if (error) throw error
  return data as Product[]
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  if (error) throw error
}
