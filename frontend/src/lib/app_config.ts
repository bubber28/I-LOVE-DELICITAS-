import { supabase } from './supabase'

export async function getAppConfig() {
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function updateAppConfig(updates: any) {
  const { data, error } = await supabase
    .from('app_config')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()
  if (error) throw error
  return data
}
