import { supabase } from './supabase';
export type Product = {
  id: string;
  nome: string;
  preco: number;
  categoria?: string;
  descricao?: string;
  imagem?: string;
};

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase.from('products').insert([product]).select();
  if (error) throw error;
  return data?.[0] as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0] as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
