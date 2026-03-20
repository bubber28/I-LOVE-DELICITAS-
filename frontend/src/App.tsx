import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContainer } from './components/layout/page-container';
import { SiteFooter } from './components/layout/site-footer';
import { SiteHeader } from './components/layout/site-header';
import {
  AdminCategoriasPage,
  AdminCuponsPage,
  AdminDashboardPage,
  AdminPedidosPage,
  AdminProdutosPage,
  AdminRelatoriosPage,
  CatalogoPage,
  CadastroPage,
  CarrinhoPage,
  CheckoutPage,
  HomePage,
  LoginPage,
  PedidosPage,
  PerfilPage
} from './pages/Pages';

const links = [
  ['/', 'Home'],
  ['/catalogo', 'Catalogo'],
  ['/carrinho', 'Carrinho'],
  ['/checkout', 'Checkout'],
  ['/pedidos', 'Pedidos'],
  ['/perfil', 'Perfil'],
  ['/login', 'Login'],
  ['/cadastro', 'Cadastro'],
  ['/admin/dashboard', 'Admin Dashboard'],
  ['/admin/pedidos', 'Admin Pedidos']
] as const;

function App() {
  return (
    <div className="min-h-screen bg-cream-50 bg-sprinkles text-choco-700">
      <SiteHeader links={links.map(([to, label]) => ({ to, label }))} />
      <main>
        <PageContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />

          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
          <Route path="/admin/produtos" element={<AdminProdutosPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriasPage />} />
          <Route path="/admin/cupons" element={<AdminCuponsPage />} />
          <Route path="/admin/relatorios" element={<AdminRelatoriosPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
