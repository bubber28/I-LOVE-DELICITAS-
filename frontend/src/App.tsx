import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PageContainer } from './components/layout/page-container';
import { SiteFooter } from './components/layout/site-footer';
import { SiteHeader } from './components/layout/site-header';
import {
  AdminCategoriasPage,
  AdminCuponsPage,
  AdminDashboardPage,
  AdminLoginPage,
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

const headerLinks = [
  ['/', 'Home'],
  ['/catalogo', 'Catalogo'],
  ['/pedidos', 'Meus pedidos']
] as const;

function RequireAdmin({ children }: { children: JSX.Element }) {
  const location = useLocation();

  // Stub temporario: ate conectar auth real, nenhuma sessao admin e considerada autenticada.
  const isAdminAuthenticated = false;

  if (!isAdminAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`;

    return <Navigate to="/admin/login" replace state={{ redirectTo }} />;
  }

  return children;
}

function App() {
  return (
    <div className="min-h-screen bg-cream-50 bg-sprinkles text-choco-700">
      <SiteHeader links={headerLinks.map(([to, label]) => ({ to, label }))} />
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

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <RequireAdmin>
                <AdminPedidosPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/produtos"
            element={
              <RequireAdmin>
                <AdminProdutosPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/categorias"
            element={
              <RequireAdmin>
                <AdminCategoriasPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/cupons"
            element={
              <RequireAdmin>
                <AdminCuponsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/relatorios"
            element={
              <RequireAdmin>
                <AdminRelatoriosPage />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </PageContainer>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
