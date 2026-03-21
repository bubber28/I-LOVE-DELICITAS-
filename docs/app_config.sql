-- Criação da tabela app_config
CREATE TABLE IF NOT EXISTS public.app_config (
  id SERIAL PRIMARY KEY,
  logo_text TEXT DEFAULT 'Delícias feitas com amor',
  logo_image_url TEXT,
  hero_title TEXT DEFAULT 'Sabor que vira memória em cada pedido',
  hero_subtitle TEXT DEFAULT 'Personalize sua caixa de doces, agende a entrega e receba tudo fresquinho ainda hoje',
  hero_button_primary TEXT DEFAULT 'Pedir agora',
  hero_button_secondary TEXT DEFAULT 'Acompanhar pedido',
  products_section_title TEXT DEFAULT 'Mais pedidos da semana',
  categories_section_title TEXT DEFAULT 'Categorias',
  primary_color TEXT DEFAULT '#FF6B6B',
  secondary_color TEXT DEFAULT '#4ECDC4',
  accent_color TEXT DEFAULT '#FFE66D',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO public.app_config (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM public.app_config);