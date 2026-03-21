import { Product, fetchProducts, createProduct, updateProduct, deleteProduct } from '../lib/products';
import { useState, useEffect } from 'react';
import { addOrder, getOrders, saveOrders, Order } from '../lib/orders';
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
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then(data => setProdutos(data)).finally(() => setLoading(false));
  }, []);

  function handleAdd(product: Product) {
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
        </CardContent>
      </Card>

      {loading && <div>Carregando produtos...</div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {produtos.map((product) => (
          <Card key={product.id}>
            <div className="h-40 rounded-t-2xl bg-gradient-to-br from-cream-200 to-blush-100" />
            <CardHeader>
              <CardTitle className="text-lg">{product.nome}</CardTitle>
              <CardDescription>{product.descricao || 'Produto delicioso!'}</CardDescription>
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
// imports já presentes no topo do arquivo
export function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleConfirmOrder() {
    const cart = getCart();
    if (!cart.length) {
      alert('Carrinho vazio. Adicione itens antes de confirmar o pedido.');
      return;
    }
    setLoading(true);
    try {
      const total = cart.reduce((sum, p) => sum + p.preco * p.qty, 0);
      const user = (await supabase.auth.getUser()).data.user;
      const order = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        total,
        items: cart.map(p => ({ id: p.id, title: p.nome, price: p.preco, qty: p.qty })),
        metadata: { user: user?.id || null, status: 'pendente' }
      };
      await addOrder(order);
      clearCart();
      alert('Pedido confirmado com sucesso!');
      navigate('/pedidos');
    } catch (e) {
      alert('Erro ao confirmar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

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
            <Button className="w-full" onClick={handleConfirmOrder} disabled={loading}>
              {loading ? 'Confirmando...' : 'Confirmar pedido'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// imports já presentes no topo do arquivo
export function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    setOrders(getOrders());
  }, []);

  if (!user) {
    return (
      <section className="space-y-6">
        <PageIntro title="Pedidos" description="Historico e acompanhamento dos pedidos." />
        <div className="text-choco-700/70">Faça login para ver seus pedidos</div>
      </section>
    );
  }

  const userOrders = orders.filter(o => o.metadata?.user === user.id);

  return (
    <section className="space-y-6">
      <PageIntro title="Pedidos" description="Historico e acompanhamento dos pedidos." />
      <div className="grid gap-4">
        {userOrders.length === 0 && <div className="text-choco-700/70">Nenhum pedido encontrado.</div>}
        {userOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="text-sm text-choco-700/70">Pedido {order.id}</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-choco-700/70">Total: R$ {order.total.toFixed(2)}</p>
              </div>
              <Badge variant="outline">Status: {order.metadata?.status || 'pendente'}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// já importado no topo
export function PerfilPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSaveProfile() {
    setMsg(null);
    if (!nome || !email) {
      setMsg('Nome e email são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        data: { nome }
      });
      if (error) throw error;
      localStorage.setItem('perfil_extra', JSON.stringify({ telefone, dataNasc }));
      setMsg('Perfil atualizado com sucesso!');
    } catch (e) {
      setMsg('Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <PageIntro title="Perfil" description="Dados da conta e preferencias." />
      <Card>
        <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
          <Input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
          <Input placeholder="Data de nascimento" value={dataNasc} onChange={e => setDataNasc(e.target.value)} />
        </CardContent>
        <div className="p-4">
          <Button className="w-full" onClick={handleSaveProfile} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          {msg && <div className="mt-2 text-sm text-choco-700/80">{msg}</div>}
        </div>
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
                    disabled={true}
                    title="Em desenvolvimento"
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [usuarios, setUsuarios] = useState<number>(0);
  const [statusCount, setStatusCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setOrders(getOrders());
      setProdutos(await fetchProducts());
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      setUsuarios(count || 0);
      // Contar pedidos por status
      const statusMap: Record<string, number> = {};
      getOrders().forEach(o => {
        const s = o.metadata?.status || 'pendente';
        statusMap[s] = (statusMap[s] || 0) + 1;
      });
      setStatusCount(statusMap);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <section className="space-y-6">
      <PageIntro title="Admin Dashboard" description="Visão geral da operação." />
      {loading && <div>Carregando métricas...</div>}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="font-semibold text-lg">Total de pedidos</p>
            <p className="text-choco-700/80 text-2xl">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="font-semibold text-lg">Total de produtos</p>
            <p className="text-choco-700/80 text-2xl">{produtos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="font-semibold text-lg">Usuários cadastrados</p>
            <p className="text-choco-700/80 text-2xl">{usuarios}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pedidos por status</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 pt-4">
          {Object.entries(statusCount).map(([status, count]) => (
            <div key={status} className="flex flex-col items-center">
              <span className="font-semibold capitalize">{status}</span>
              <span className="text-choco-700/80 text-xl">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}


export function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const statusList = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  function handleStatusChange(orderId: string, status: string) {
    setLoading(true);
    const updated = orders.map(o => o.id === orderId ? { ...o, metadata: { ...o.metadata, status } } : o);
    saveOrders(updated);
    setOrders(updated);
    setLoading(false);
  }

  return (
    <section className="space-y-6">
      <PageIntro title="Admin Pedidos" description="Gestão de pedidos da loja." />
      <div className="grid gap-4">
        {orders.length === 0 && <div className="text-choco-700/70">Nenhum pedido encontrado.</div>}
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-semibold">Pedido {order.id}</p>
                <p className="text-choco-700/70">Usuário: {order.metadata?.user || 'N/A'}</p>
                <p className="text-choco-700/70">Total: R$ {order.total.toFixed(2)}</p>
                <p className="text-choco-700/70">Status: {order.metadata?.status || 'pendente'}</p>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={order.metadata?.status || 'pendente'}
                  onChange={e => handleStatusChange(order.id, e.target.value)}
                  disabled={loading}
                  className="border rounded px-2 py-1"
                >
                  {statusList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}


export function AdminProdutosPage() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduto, setEditProduto] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>({ nome: '', preco: 0, categoria: '', descricao: '', imagem: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarProdutos() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProdutos(data);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarProdutos(); }, []);

  function abrirNovo() {
    setEditProduto(null);
    setForm({ nome: '', preco: 0, categoria: '', descricao: '', imagem: '' });
    setModalOpen(true);
  }

  function abrirEditar(produto: Product) {
    setEditProduto(produto);
    setForm({ nome: produto.nome, preco: produto.preco, categoria: produto.categoria || '', descricao: produto.descricao || '', imagem: produto.imagem || '' });
    setModalOpen(true);
  }

  async function salvarProduto(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      if (editProduto) {
        await updateProduct(editProduto.id, form);
      } else {
        await createProduct(form);
      }
      setModalOpen(false);
      carregarProdutos();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function excluirProduto(id: string) {
    if (!window.confirm('Excluir este produto?')) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      carregarProdutos();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <PageIntro title="Admin Produtos" description="Cadastro e estoque de produtos." />
      <Button onClick={abrirNovo} className="mb-4">Novo produto</Button>
      {erro && <div className="text-red-600">{erro}</div>}
      <div className="grid gap-4">
        {produtos.map((produto) => (
          <Card key={produto.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-semibold">{produto.nome}</p>
                <p className="text-choco-700/70">R$ {produto.preco.toFixed(2)}</p>
                <p className="text-choco-700/70 text-xs">{produto.categoria}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => abrirEditar(produto)}>Editar</Button>
                <Button size="sm" variant="accent" onClick={() => excluirProduto(produto.id)}>Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={salvarProduto} className="bg-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold mb-2">{editProduto ? 'Editar produto' : 'Novo produto'}</h2>
            <Input placeholder="Nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required />
            <Input placeholder="Preço" type="number" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: Number(e.target.value) }))} required />
            <Input placeholder="Categoria" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} />
            <Input placeholder="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
            <Input placeholder="URL da imagem" value={form.imagem} onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))} />
            <div className="flex gap-2 mt-2">
              <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
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
