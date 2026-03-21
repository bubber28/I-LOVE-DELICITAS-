export type RelatorioVenda = {
  id: string;
  data: string;
  total: number;
  produto_id?: string;
  quantidade?: number;
};

export async function fetchRelatorioVendas(periodo: {inicio: string, fim: string}) {
  // Exemplo: select * from orders where createdAt between inicio and fim
  const { data, error } = await supabase.rpc('relatorio_vendas', { inicio: periodo.inicio, fim: periodo.fim });
  if (error) throw error;
  return data as RelatorioVenda[];
}

export async function fetchMaisVendidos() {
  const { data, error } = await supabase.rpc('produtos_mais_vendidos');
  if (error) throw error;
  return data as RelatorioVenda[];
}

export async function fetchFaturamentoMensal() {
  const { data, error } = await supabase.rpc('faturamento_mensal');
  if (error) throw error;
  return data as RelatorioVenda[];
}
import { supabase } from './supabase';
