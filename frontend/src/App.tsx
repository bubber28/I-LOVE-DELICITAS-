import { useEffect } from 'react'
import { getAppConfig } from './lib/app_config'



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SiteHeader } from './components/layout/site-header'
import { SiteFooter } from './components/layout/site-footer'
import { AuthProvider } from './contexts/AuthContext'
import { RequireAdmin } from './components/auth/RequireAdmin'
import {
  HomePage,
  CatalogoPage,
  CarrinhoPage,
  CheckoutPage,
  PedidosPage,
  PerfilPage,
  LoginPage,
  CadastroPage,
  AdminLoginPage,
  AdminDashboardPage,
  AdminPedidosPage,
  AdminProdutosPage,
  AdminCategoriasPage,
  AdminCuponsPage,
  AdminRelatoriosPage,
  AdminConfiguracoesPage,
} from './pages/Pages'


const links = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/carrinho', label: 'Carrinho' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/perfil', label: 'Perfil' },
]

export function App() {
  useEffect(() => {
    getAppConfig().then(config => {
      if (config) {
        const root = document.documentElement;
        if (config.primary_color) root.style.setProperty('--primary', config.primary_color);
        if (config.secondary_color) root.style.setProperty('--secondary', config.secondary_color);
        if (config.accent_color) root.style.setProperty('--accent', config.accent_color);
      }
    });
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <SiteHeader links={links} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogoPage />} />
              <Route path="/carrinho" element={<CarrinhoPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedidos" element={<PedidosPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<CadastroPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
              <Route path="/admin/pedidos" element={<RequireAdmin><AdminPedidosPage /></RequireAdmin>} />
              <Route path="/admin/produtos" element={<RequireAdmin><AdminProdutosPage /></RequireAdmin>} />
              <Route path="/admin/categorias" element={<RequireAdmin><AdminCategoriasPage /></RequireAdmin>} />
              <Route path="/admin/cupons" element={<RequireAdmin><AdminCuponsPage /></RequireAdmin>} />
              <Route path="/admin/relatorios" element={<RequireAdmin><AdminRelatoriosPage /></RequireAdmin>} />
              <Route path="/admin/configuracoes" element={<RequireAdmin><AdminConfiguracoesPage /></RequireAdmin>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <SiteFooter />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
