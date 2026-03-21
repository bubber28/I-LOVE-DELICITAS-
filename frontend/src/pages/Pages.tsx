import { useState, useEffect } from 'react';
import { addToCart } from '../lib/cart';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCart, updateQty, removeFromCart, clearCart, CartProduct } from '../lib/cart';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

function PageIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold tracking-tight text-choco-700">{title}</h2>
      <p className="mt-2 text-choco-700/80">{description}</p>
    </div>
  );
}

export function HomePage() {
  const highlights = ['Brigadeiro Belga', 'Torta de Morango', 'Cinnamon Roll'];
  const categories = ['Bolos', 'Doces Finos', 'Salgados', 'Bebidas'];

  return (
    <section className="space-y-8">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-cream-100 via-white to-blush-100">
        <CardHeader className="max-w-2xl">
          <Badge className="w-fit" variant="accent">
            Novidade da Semana
          </Badge>
          <CardTitle className="text-4xl leading-tight text-choco-700">Sabor que vira memoria em cada pedido.</CardTitle>
          <CardDescription>
            Personalize sua caixa de doces, agende entrega e receba tudo fresquinho ainda hoje.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link to="/catalogo">Pedir agora</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/pedidos">Acompanhar pedido</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item}>
            <CardHeader>
              <CardTitle className="text-lg">{item}</CardTitle>
              <CardDescription>Receita autoral com ingredientes premium.</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Escolha seu momento doce.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export function CatalogoPage() {
  const categories = ['Todos', 'Bolos', 'Tortas', 'Doces Finos', 'Combos'];
  // Mock explícito de produtos
  const PRODUCTS = [
    { id: '1', nome: 'Bolo Red Velvet', preco: 39.9 },
    { id: '2', nome: 'Cheesecake de Frutas Vermelhas', preco: 42.5 },
    { id: '3', nome: 'Mini Churros Gourmet', preco: 29.9 },
    { id: '4', nome: 'Kit Festa para 6 pessoas', preco: 119.0 },
    { id: '5', nome: 'Torta Banoffee', preco: 44.0 },
    { id: '6', nome: 'Caixa Brigadeiros Sortidos', preco: 35.0 },
  ];
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAdd(product: typeof PRODUCTS[number]) {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  }

  return (
    <section className="space-y-6">
      <PageIntro title="Catalogo" description="Lista de produtos por categorias." />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input placeholder="Buscar por bolo, doce, categoria..." />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant={category === 'Todos' ? 'accent' : 'default'}>
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id}>
            <div className="h-40 rounded-t-2xl bg-gradient-to-br from-cream-200 to-blush-100" />
            <CardHeader>
              <CardTitle className="text-lg">{product.nome}</CardTitle>
              <CardDescription>Imagem placeholder e descricao promocional.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="font-semibold text-choco-700">R$ {product.preco.toFixed(2)}</p>
              <Button size="sm" onClick={() => handleAdd(product)} disabled={addedId === product.id}>
                {addedId === product.id ? 'Adicionado!' : 'Adicionar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CarrinhoPage() {
  const [cart, setCart] = useState<CartProduct[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  function handleQty(id: string, qty: number) {
    updateQty(id, qty);
    setCart(getCart());
  }

  function handleRemove(id: string) {
    removeFromCart(id);
    setCart(getCart());
  }

  const total = cart.reduce((sum, p) => sum + p.preco * p.qty, 0);

  return (
    <section className="space-y-6">
      <PageIntro title="Carrinho" description="Resumo dos itens selecionados." />
      <Card>
        <CardHeader>
          <CardTitle>Seu pedido</CardTitle>
          <CardDescription>Confira antes de finalizar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 && <div className="text-choco-700/70">Seu carrinho está vazio.</div>}
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
              <span>{item.qty}x {item.nome}</span>
              <span>R$ {(item.preco * item.qty).toFixed(2)}</span>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="secondary" onClick={() => handleQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</Button>
                <Input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={e => handleQty(item.id, Number(e.target.value))}
                  className="w-12 px-1 text-center"
                  style={{ minWidth: 0 }}
                />
                <Button size="sm" variant="secondary" onClick={() => handleQty(item.id, item.qty + 1)}>+</Button>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(item.id)} title="Remover">🗑️</Button>
              </div>
            </div>
          ))}
          {cart.length > 0 && <>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full">
              <Link to="/checkout">Ir para checkout</Link>
            </Button>
          </>}
        </CardContent>
      </Card>
    </section>
  );
}
export function CheckoutPage() {
  return (
    <section className="space-y-6">
      <PageIntro title="Checkout" description="Pagamento e endereco de entrega." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Nome completo" />
            <Input placeholder="Endereco" />
            <Input placeholder="Complemento" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs defaultValue="cartao">
              <TabsList className="w-full">
                <TabsTrigger className="flex-1" value="cartao">
                  Cartao
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="pix">
                  Pix
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cartao" className="space-y-3">
                <Input placeholder="Numero do cartao" />
                <Input placeholder="Nome impresso" />
              </TabsContent>
              <TabsContent value="pix">
                <p className="text-sm text-choco-700/80">Ao concluir, exibimos o QR Code de pagamento.</p>
              </TabsContent>
            </Tabs>
            <Button className="w-full">Confirmar pedido</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function PedidosPage() {
  const statuses = [
    { code: '#1298', status: 'Em preparo', eta: '20 min' },
    { code: '#1291', status: 'Saiu para entrega', eta: '12 min' }
  ];

  return (
    <section className="space-y-6">
      <PageIntro title="Pedidos" description="Historico e acompanhamento dos pedidos." />
      <div className="grid gap-4">
        {statuses.map((item) => (
          <Card key={item.code}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-choco-700/70">Pedido {item.code}</p>
                <p className="font-semibold">{item.status}</p>
              </div>
              <Badge variant="outline">Previsao: {item.eta}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function PerfilPage() {
  return (
    <section className="space-y-6">
      <PageIntro title="Perfil" description="Dados da conta e preferencias." />
      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
          <Input placeholder="Nome" />
          <Input placeholder="Email" />
          <Input placeholder="Telefone" />
          <Input placeholder="Data de nascimento" />
        </CardContent>
      </Card>
    </section>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setLoading(false);
    if (error) {
      setErro('Email ou senha inválidos.');
    } else {
      navigate('/');
    }
  }

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Login" description="Acesso de clientes e admins." />
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-3 pt-6">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
            {erro && <div className="text-red-600 text-sm">{erro}</div>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}

export function CadastroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(false);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } }
    });
    setLoading(false);
    if (error) {
      setErro(error.message || 'Erro ao criar conta.');
    } else {
      setSucesso(true);
      setTimeout(() => navigate('/'), 1500);
    }
  }

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Cadastro" description="Criacao de nova conta." />
      <Card>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-3 pt-6">
            <Input
              placeholder="Nome completo"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              autoComplete="new-password"
              disabled={loading}
            />
            {erro && <div className="text-red-600 text-sm">{erro}</div>}
            {sucesso && <div className="text-green-700 text-sm">Cadastro realizado! Verifique seu email.</div>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar conta'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </section>
  );
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { redirectTo?: string } };

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      setErro(error.message);
      return;
    }

    const redirectTo = location.state?.redirectTo || '/admin/dashboard';
    navigate(redirectTo, { replace: true });
  }

  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Admin Login" description="Acesso administrativo." />
      <Card>
        <CardContent className="space-y-3 pt-6">
          <form className="space-y-3" onSubmit={onSubmit}>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar no admin'}
            </Button>
            {erro ? <p className="text-sm text-red-600">{erro}</p> : null}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

const adminNavItems = [
  { label: 'Pedidos', path: '/admin/pedidos' },
  { label: 'Produtos', path: '/admin/produtos' },
  { label: 'Relatórios', path: '/admin/relatorios' }
] as const;

function AdminNav() {
  const location = useLocation();
  
  return (
    <Card>
      <CardContent className="space-y-2 pt-6">
        <Badge className="w-fit" variant="accent">
          Admin
        </Badge>
        <p className="text-sm text-choco-700/80">Navegação de módulos.</p>
        <div className="space-y-2">
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                asChild
                variant={isActive ? 'accent' : 'secondary'}
                className="w-full justify-start"
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface AdminPageConfig {
  title: string;
  description: string;
  actions?: { label: string; disabled?: boolean }[];
  contentStatus: string;
}

const adminPageConfigs: Record<string, AdminPageConfig> = {
  '/admin/dashboard': {
    title: 'Admin Dashboard',
    description: 'Visão geral da operação.',
    actions: [],
    contentStatus: 'Métricas e resumo em desenvolvimento'
  },
  '/admin/pedidos': {
    title: 'Admin Pedidos',
    description: 'Gestão de pedidos da loja.',
    actions: [{ label: 'Novo pedido', disabled: true }],
    contentStatus: 'Integração com banco de dados em breve'
  },
  '/admin/produtos': {
    title: 'Admin Produtos',
    description: 'Cadastro e estoque de produtos.',
    actions: [{ label: 'Novo produto', disabled: true }],
    contentStatus: 'Funcionalidade em breve'
  },
  '/admin/categorias': {
    title: 'Admin Categorias',
    description: 'Organização do catálogo.',
    actions: [{ label: 'Nova categoria', disabled: true }],
    contentStatus: 'Funcionalidade em breve'
  },
  '/admin/cupons': {
    title: 'Admin Cupons',
    description: 'Regras promocionais e descontos.',
    actions: [{ label: 'Novo cupom', disabled: true }],
    contentStatus: 'Funcionalidade em breve'
  },
  '/admin/relatorios': {
    title: 'Admin Relatórios',
    description: 'Indicadores de vendas e performance.',
    actions: [],
    contentStatus: 'Relatórios em desenvolvimento'
  }
};

function AdminPage() {
  const location = useLocation();
  const config = adminPageConfigs[location.pathname] || {
    title: 'Admin',
    description: 'Página administrativa.',
    actions: [],
    contentStatus: 'Página em carregamento'
  };

  return (
    <section className="space-y-6">
      <PageIntro title={config.title} description={config.description} />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <AdminNav />

        <div className="space-y-4">
          {config.actions && config.actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {config.actions.map((action) => (
                  <Button
                    key={action.label}
                    disabled={action.disabled}
                    title={action.disabled ? 'Funcionalidade em breve' : ''}
                  >
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Painel</CardTitle>
              <CardDescription>{config.contentStatus}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-xl border border-choco-500/20 bg-choco-50/30 p-4 text-sm">
                <p className="text-choco-700/70">
                  ℹ️ {config.contentStatus}
                </p>
              </div>
              <div className="rounded-xl border border-choco-500/10 p-3 text-sm">
                <p className="font-medium">Registro 01</p>
                <p className="text-choco-700/70">Status: ativo</p>
              </div>
              <div className="rounded-xl border border-choco-500/10 p-3 text-sm">
                <p className="font-medium">Registro 02</p>
                <p className="text-choco-700/70">Status: revisao</p>
              </div>
            </CardContent>
          </Card>

          {location.pathname === '/admin/dashboard' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações (Em breve)</CardTitle>
                <CardDescription>Personalizações do app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button disabled title="Funcionalidade em breve" className="w-full">
                  🎨 Tema / Cores (Em breve)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

export function AdminDashboardPage() {
  return <AdminPage />;
}

export function AdminPedidosPage() {
  return <AdminPage />;
}

export function AdminProdutosPage() {
  return <AdminPage />;
}

export function AdminCategoriasPage() {
  return <AdminPage />;
}

export function AdminCuponsPage() {
  return <AdminPage />;
}

export function AdminRelatoriosPage() {
  return <AdminPage />;
}
