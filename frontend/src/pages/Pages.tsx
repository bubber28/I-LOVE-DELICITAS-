function Page({ title, description }: { title: string; description: string }) {
  return (
    <section className="page-card">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}

export function HomePage() {
  return <Page title="Home" description="Vitrine principal da loja." />;
}

export function CatalogoPage() {
  return <Page title="Catalogo" description="Lista de produtos por categorias." />;
}

export function CarrinhoPage() {
  return <Page title="Carrinho" description="Resumo dos itens selecionados." />;
}

export function CheckoutPage() {
  return <Page title="Checkout" description="Pagamento e endereco de entrega." />;
}

export function PedidosPage() {
  return <Page title="Pedidos" description="Historico e acompanhamento dos pedidos." />;
}

export function PerfilPage() {
  return <Page title="Perfil" description="Dados da conta e preferencias." />;
}

export function LoginPage() {
  return <Page title="Login" description="Acesso de clientes e admins." />;
}

export function CadastroPage() {
  return <Page title="Cadastro" description="Criacao de nova conta." />;
}

export function AdminDashboardPage() {
  return <Page title="Admin Dashboard" description="Visao geral da operacao." />;
}

export function AdminPedidosPage() {
  return <Page title="Admin Pedidos" description="Gestao de pedidos da loja." />;
}

export function AdminProdutosPage() {
  return <Page title="Admin Produtos" description="Cadastro e estoque de produtos." />;
}

export function AdminCategoriasPage() {
  return <Page title="Admin Categorias" description="Organizacao do catalogo." />;
}

export function AdminCuponsPage() {
  return <Page title="Admin Cupons" description="Regras promocionais e descontos." />;
}

export function AdminRelatoriosPage() {
  return <Page title="Admin Relatorios" description="Indicadores de vendas e performance." />;
}
