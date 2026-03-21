
import { supabase } from './supabase'

export interface AppConfig {
  id: number
  logo_text: string
  logo_image_url: string | null
  hero_title: string
  hero_subtitle: string
  hero_button_primary: string
  hero_button_secondary: string
  products_section_title: string
  categories_section_title: string
  primary_color: string
  secondary_color: string
  accent_color: string
  updated_at: string
}

export async function getAppConfig(): Promise<AppConfig> {
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .single()
  if (error) throw error
  return data as AppConfig
}

export async function updateAppConfig(updates: Partial<AppConfig>) {
  const { data, error } = await supabase
    .from('app_config')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()
  if (error) throw error
  return data as AppConfig
}
