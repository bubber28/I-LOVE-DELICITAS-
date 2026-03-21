export type AppSettings = {
  id: string;
  cor_primaria: string;
  cor_secundaria: string;
  cor_destaque: string;
  logo_url?: string;
};
// Upload de logo PNG para bucket 'logos'
export async function uploadLogo(file: File): Promise<string> {
  if (file.type !== 'image/png') throw new Error('Apenas PNG é permitido');
  if (file.size > 2 * 1024 * 1024) throw new Error('Tamanho máximo: 2MB');
  const fileName = `logo_${Date.now()}.png`;
  const { data, error } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true, contentType: 'image/png' });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('logos').getPublicUrl(data.path);
  return urlData.publicUrl;
}

export async function fetchSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) throw error;
  return data as AppSettings;
}

export async function updateSettings(updates: Partial<AppSettings>) {
  const { data, error } = await supabase.from('settings').update(updates).eq('id', 'default').select();
  if (error) throw error;
  return data?.[0] as AppSettings;
}
import { supabase } from './supabase';
