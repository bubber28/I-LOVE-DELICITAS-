export type Categoria = {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
};

export async function fetchCategorias() {
  const { data, error } = await supabase.from('categorias').select('*');
  if (error) throw error;
  return data as Categoria[];
}

export async function createCategoria(categoria: Omit<Categoria, 'id'>) {
  const { data, error } = await supabase.from('categorias').insert([categoria]).select();
  if (error) throw error;
  return data?.[0] as Categoria;
}

export async function updateCategoria(id: string, updates: Partial<Categoria>) {
  const { data, error } = await supabase.from('categorias').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0] as Categoria;
}

export async function deleteCategoria(id: string) {
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) throw error;
}
import { supabase } from './supabase';
