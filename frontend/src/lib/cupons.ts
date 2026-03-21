export type Cupom = {
  id: string;
  codigo: string;
  desconto: number;
  validade: string;
  max_uso: number;
};

export async function fetchCupons() {
  const { data, error } = await supabase.from('coupons').select('*');
  if (error) throw error;
  return data as Cupom[];
}

export async function createCupom(cupom: Omit<Cupom, 'id'>) {
  const { data, error } = await supabase.from('coupons').insert([cupom]).select();
  if (error) throw error;
  return data?.[0] as Cupom;
}

export async function updateCupom(id: string, updates: Partial<Cupom>) {
  const { data, error } = await supabase.from('coupons').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0] as Cupom;
}

export async function deleteCupom(id: string) {
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) throw error;
}
import { supabase } from './supabase';
