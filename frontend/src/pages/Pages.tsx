import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from '../components/ui/separator';

// Hooks, Contexts, Utils
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Libs
import { supabase } from "../lib/supabase";
import { getCart, addToCart, updateQty, removeFromCart, clearCart, CartProduct } from "../lib/cart";
import { getOrders, addOrder, saveOrders, Order } from "../lib/orders";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Product, fetchProducts, createProduct, updateProduct, deleteProduct } from "../lib/products";

import { getAppConfig, updateAppConfig } from "../lib/app_config";
import { uploadLogo } from "../lib/settings";



export function AdminConfiguracoesPage() {
  const [tab, setTab] = useState('identidade');
  const [form, setForm] = useState<any>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    getAppConfig().then(setForm).catch(e => setErro('Erro ao carregar configurações.'));
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setLoading(true);
    try {
      let logo_image_url = form.logo_image_url;
      if (logoFile) {
        logo_image_url = await uploadLogo(logoFile) || undefined;
      }
      await updateAppConfig({ ...form, logo_image_url });
      setSucesso('Configurações salvas com sucesso!');
    } catch (e: any) {
      setErro(e.message || 'Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  }

  function removerLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setForm((f: any) => ({ ...f, logo_image_url: null }));
  }

  if (!form) return <div>Carregando...</div>;

  return (
    <section className="space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Configurações</h1><p className="text-choco-700/80">Personalize as configurações do app.</p></div>
      {erro && <div className="text-red-600">{erro}</div>}
      {sucesso && <div className="text-green-600">{sucesso}</div>}
      <Tabs defaultValue={tab} onValueChange={setTab} className="w-full max-w-2xl">
        <TabsList className="mb-4">
          <TabsTrigger value="identidade">Identidade</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="secoes">Seções</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>
        <form onSubmit={salvar} className="bg-white p-6 rounded shadow w-full space-y-3">
          <TabsContent value="identidade">
            <div>
              <label className="block font-semibold mb-1">Logo texto</label>
              <Input value={form.logo_text || ''} onChange={e => setForm((f: any) => ({ ...f, logo_text: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Logo imagem (PNG, máx 2MB, altura sugerida 40-60px)</label>
              {form.logo_image_url && !logoPreview && (
                <div className="mb-2 flex items-center gap-4">
                  <img src={form.logo_image_url} alt="Logo" style={{ height: 48, width: 'auto', background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
                  <Button type="button" variant="secondary" onClick={removerLogo} disabled={loading}>Remover Logo</Button>
                </div>
              )}
              {logoPreview && (
                <div className="mb-2 flex items-center gap-4">
                  <img src={logoPreview} alt="Logo" style={{ height: 48, width: 'auto', background: '#fff', borderRadius: 8, border: '1px solid #eee' }} />
                  <Button type="button" variant="secondary" onClick={removerLogo} disabled={loading}>Remover Logo</Button>
                </div>
              )}
              <Input
                type="file"
                accept="image/png"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }
                }}
                disabled={loading}
              />
            </div>
          </TabsContent>
          <TabsContent value="hero">
            <div>
              <label className="block font-semibold mb-1">Título principal</label>
              <Input value={form.hero_title || ''} onChange={e => setForm((f: any) => ({ ...f, hero_title: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Subtítulo</label>
              <textarea className="w-full border rounded p-2" value={form.hero_subtitle || ''} onChange={e => setForm((f: any) => ({ ...f, hero_subtitle: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Texto botão principal</label>
              <Input value={form.hero_button_primary || ''} onChange={e => setForm((f: any) => ({ ...f, hero_button_primary: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Texto botão secundário</label>
              <Input value={form.hero_button_secondary || ''} onChange={e => setForm((f: any) => ({ ...f, hero_button_secondary: e.target.value }))} />
            </div>
          </TabsContent>
          <TabsContent value="secoes">
            <div>
              <label className="block font-semibold mb-1">Título seção produtos</label>
              <Input value={form.products_section_title || ''} onChange={e => setForm((f: any) => ({ ...f, products_section_title: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Título seção categorias</label>
              <Input value={form.categories_section_title || ''} onChange={e => setForm((f: any) => ({ ...f, categories_section_title: e.target.value }))} />
            </div>
          </TabsContent>
          <TabsContent value="aparencia">
            <div>
              <label className="block font-semibold mb-1">Cor primária</label>
              <Input type="color" value={form.primary_color || '#FF6B6B'} onChange={e => setForm((f: any) => ({ ...f, primary_color: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cor secundária</label>
              <Input type="color" value={form.secondary_color || '#4ECDC4'} onChange={e => setForm((f: any) => ({ ...f, secondary_color: e.target.value }))} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Cor de destaque</label>
              <Input type="color" value={form.accent_color || '#FFE66D'} onChange={e => setForm((f: any) => ({ ...f, accent_color: e.target.value }))} />
            </div>
          </TabsContent>
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </Tabs>
    </section>
  );
}

export function HomePage() {
  const [config, setConfig] = useState<any>(null);
  const highlights = ['Brigadeiro Belga', 'Torta de Morango', 'Cinnamon Roll'];
  const categories = ['Bolos', 'Doces Finos', 'Salgados', 'Bebidas'];

  useEffect(() => {
    getAppConfig().then(setConfig);
  }, []);

  useEffect(() => {
    if (config) {
      const root = document.documentElement;
      if (config.primary_color) root.style.setProperty('--primary', config.primary_color);
      if (config.secondary_color) root.style.setProperty('--secondary', config.secondary_color);
      if (config.accent_color) root.style.setProperty('--accent', config.accent_color);
    }
  }, [config]);

  if (!config) return <div>Carregando...</div>;

  return (
    <section className="space-y-8">
      <Card className="relative overflow-hidden border-none bg-gradient-to-br from-cream-100 via-white to-blush-100">
        <CardHeader className="max-w-2xl">
          <Badge className="w-fit" variant="default">
            Novidade da Semana
          </Badge>
          <CardTitle className="text-4xl leading-tight text-choco-700">{config.hero_title || 'Sabor que vira memória em cada pedido.'}</CardTitle>
          <CardDescription>
            {config.hero_subtitle || 'Personalize sua caixa de doces, agende entrega e receba tudo fresquinho ainda hoje.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="default">
            <Link to="/catalogo">{config.hero_button_primary || 'Pedir agora'}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/pedidos">{config.hero_button_secondary || 'Acompanhar pedido'}</Link>
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
          <CardTitle>{config.products_section_title || 'Produtos'}</CardTitle>
          <CardDescription>{config.categories_section_title || 'Categorias'}</CardDescription>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Catalogo</h1><p className="text-choco-700/80">Lista de produtos por categorias.</p></div>

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
      <div className="mb-6"><h1 className="text-2xl font-bold">Carrinho</h1><p className="text-choco-700/80">Resumo dos itens selecionados.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Checkout</h1><p className="text-choco-700/80">Pagamento e endereco de entrega.</p></div>
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
        <div className="mb-6"><h1 className="text-2xl font-bold">Pedidos</h1><p className="text-choco-700/80">Historico e acompanhamento dos pedidos.</p></div>
        <div className="text-choco-700/70">Faça login para ver seus pedidos</div>
      </section>
    );
  }

  const userOrders = orders.filter(o => o.metadata?.user === user.id);

  return (
    <section className="space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Pedidos</h1><p className="text-choco-700/80">Historico e acompanhamento dos pedidos.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Perfil</h1><p className="text-choco-700/80">Dados da conta e preferencias.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Login</h1><p className="text-choco-700/80">Acesso de clientes e admins.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Cadastro</h1><p className="text-choco-700/80">Criacao de nova conta.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Login</h1><p className="text-choco-700/80">Acesso administrativo.</p></div>
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
        <Badge className="w-fit" variant="default">
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
                variant={isActive ? 'default' : 'secondary'}
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
      <div className="mb-6"><h1 className="text-2xl font-bold">{config.title}</h1><p className="text-choco-700/80">{config.description}</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-choco-700/80">Visão geral da operação.</p></div>
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Pedidos</h1><p className="text-choco-700/80">Gestão de pedidos da loja.</p></div>
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
  const [form, setForm] = useState<any>({
    nome: '', preco: 0, categoria: '', descricao: '', imagem: '', estoque: 0,
    cores: [], tamanhos: [],
  });
  const [imgPreview, setImgPreview] = useState<string | null>(null);
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
    setForm({ nome: '', preco: 0, categoria: '', descricao: '', imagem: '', estoque: 0, cores: [], tamanhos: [] });
    setImgPreview(null);
    setModalOpen(true);
  }

  function abrirEditar(produto: any) {
    setEditProduto(produto);
    setForm({
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria || '',
      descricao: produto.descricao || '',
      imagem: produto.imagem || '',
      estoque: produto.estoque || 0,
      cores: produto.cores || [],
      tamanhos: produto.tamanhos || [],
    });
    setImgPreview(produto.imagem || null);
    setModalOpen(true);
  }

  async function salvarProduto(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    let imgUrl = form.imagem;
    try {
      // Upload imagem se arquivo novo
      if (form.imagem && form.imagem instanceof File) {
        const file = form.imagem;
        const { data, error } = await supabase.storage.from('produtos').upload(`img_${Date.now()}`, file, { upsert: true });
        if (error) throw error;
        const { data: publicData } = supabase.storage.from('produtos').getPublicUrl(data.path);
        imgUrl = publicData.publicUrl;
      }
      const payload = { ...form, imagem: imgUrl };
      if (editProduto) {
        await updateProduct(editProduto.id, payload);
      } else {
        await createProduct(payload);
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
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Produtos</h1><p className="text-choco-700/80">Cadastro e estoque de produtos.</p></div>
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
                <Button size="sm" variant="default" onClick={() => excluirProduto(produto.id)}>Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={salvarProduto} className="bg-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold mb-2">{editProduto ? 'Editar produto' : 'Novo produto'}</h2>
            <Input placeholder="Nome" value={form.nome} onChange={e => setForm((f: any) => ({ ...f, nome: e.target.value }))} required />
            <Input placeholder="Preço" type="number" value={form.preco} onChange={e => setForm((f: any) => ({ ...f, preco: Number(e.target.value) }))} required />
            <select value={form.categoria} onChange={e => setForm((f: any) => ({ ...f, categoria: e.target.value }))} className="w-full border rounded p-2">
              <option value="">Selecione a categoria</option>
              <option value="Camisetas">Camisetas</option>
              <option value="Calças">Calças</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Outros">Outros</option>
            </select>
            <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm((f: any) => ({ ...f, descricao: e.target.value }))} className="w-full border rounded p-2" />
            <Input placeholder="Estoque" type="number" value={form.estoque} onChange={e => setForm((f: any) => ({ ...f, estoque: Number(e.target.value) }))} />
            <div className="flex flex-wrap gap-2">
              <span className="font-semibold">Cores:</span>
              {["Vermelho","Azul","Verde","Preto","Branco","Amarelo","Rosa"].map(cor => (
                <label key={cor} className="flex items-center gap-1">
                  <input type="checkbox" checked={form.cores.includes(cor)} onChange={e => {
                    setForm((f: any) => ({ ...f, cores: e.target.checked ? [...f.cores, cor] : f.cores.filter((x: string) => x !== cor) }));
                  }} /> {cor}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-semibold">Tamanhos:</span>
              {["P","M","G","GG","XG"].map(tam => (
                <label key={tam} className="flex items-center gap-1">
                  <input type="checkbox" checked={form.tamanhos.includes(tam)} onChange={e => {
                    setForm((f: any) => ({ ...f, tamanhos: e.target.checked ? [...f.tamanhos, tam] : f.tamanhos.filter((x: string) => x !== tam) }));
                  }} /> {tam}
                </label>
              ))}
            </div>
            <div>
              <span className="font-semibold">Imagem:</span>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  setForm((f: any) => ({ ...f, imagem: file }));
                  setImgPreview(URL.createObjectURL(file));
                }
              }} />
              {imgPreview && <img src={imgPreview} alt="preview" className="mt-2 max-h-32 rounded" />}
            </div>
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


import { Categoria, fetchCategorias, createCategoria, updateCategoria, deleteCategoria } from '../lib/categorias';

export function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategoria, setEditCategoria] = useState<Categoria | null>(null);
  const [form, setForm] = useState<any>({ nome: '', slug: '', descricao: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarCategorias() {
    setLoading(true);
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarCategorias(); }, []);

  function abrirNovo() {
    setEditCategoria(null);
    setForm({ nome: '', slug: '', descricao: '' });
    setModalOpen(true);
  }

  function abrirEditar(categoria: Categoria) {
    setEditCategoria(categoria);
    setForm({ nome: categoria.nome, slug: categoria.slug, descricao: categoria.descricao || '' });
    setModalOpen(true);
  }

  async function salvarCategoria(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      if (editCategoria) {
        await updateCategoria(editCategoria.id, form);
      } else {
        await createCategoria(form);
      }
      setModalOpen(false);
      carregarCategorias();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function excluirCategoria(id: string) {
    if (!window.confirm('Excluir esta categoria?')) return;
    setLoading(true);
    try {
      await deleteCategoria(id);
      carregarCategorias();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Categorias</h1><p className="text-choco-700/80">Gerencie as categorias de produtos.</p></div>
      <Button onClick={abrirNovo} className="mb-4">Nova categoria</Button>
      {erro && <div className="text-red-600">{erro}</div>}
      <div className="grid gap-4">
        {categorias.map((categoria) => (
          <Card key={categoria.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-semibold">{categoria.nome}</p>
                <p className="text-choco-700/70 text-xs">{categoria.slug}</p>
                <p className="text-choco-700/70 text-xs">{categoria.descricao}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => abrirEditar(categoria)}>Editar</Button>
                <Button size="sm" variant="default" onClick={() => excluirCategoria(categoria.id)}>Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={salvarCategoria} className="bg-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold mb-2">{editCategoria ? 'Editar categoria' : 'Nova categoria'}</h2>
            <Input placeholder="Nome" value={form.nome} onChange={e => setForm((f: any) => ({ ...f, nome: e.target.value }))} required />
            <Input placeholder="Slug" value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))} required />
            <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm((f: any) => ({ ...f, descricao: e.target.value }))} className="w-full border rounded p-2" />
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


import { Cupom, fetchCupons, createCupom, updateCupom, deleteCupom } from '../lib/cupons';

export function AdminCuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCupom, setEditCupom] = useState<Cupom | null>(null);
  const [form, setForm] = useState<any>({ codigo: '', desconto: 0, validade: '', max_uso: 1 });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarCupons() {
    setLoading(true);
    try {
      const data = await fetchCupons();
      setCupons(data);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarCupons(); }, []);

  function abrirNovo() {
    setEditCupom(null);
    setForm({ codigo: '', desconto: 0, validade: '', max_uso: 1 });
    setModalOpen(true);
  }

  function abrirEditar(cupom: Cupom) {
    setEditCupom(cupom);
    setForm({ codigo: cupom.codigo, desconto: cupom.desconto, validade: cupom.validade, max_uso: cupom.max_uso });
    setModalOpen(true);
  }

  async function salvarCupom(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    try {
      if (editCupom) {
        await updateCupom(editCupom.id, form);
      } else {
        await createCupom(form);
      }
      setModalOpen(false);
      carregarCupons();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function excluirCupom(id: string) {
    if (!window.confirm('Excluir este cupom?')) return;
    setLoading(true);
    try {
      await deleteCupom(id);
      carregarCupons();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Cupons</h1><p className="text-choco-700/80">Gerencie os cupons de desconto.</p></div>
      <Button onClick={abrirNovo} className="mb-4">Novo cupom</Button>
      {erro && <div className="text-red-600">{erro}</div>}
      <div className="grid gap-4">
        {cupons.map((cupom) => (
          <Card key={cupom.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div>
                <p className="font-semibold">{cupom.codigo}</p>
                <p className="text-choco-700/70 text-xs">Desconto: {cupom.desconto}%</p>
                <p className="text-choco-700/70 text-xs">Validade: {cupom.validade}</p>
                <p className="text-choco-700/70 text-xs">Máx. uso: {cupom.max_uso}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => abrirEditar(cupom)}>Editar</Button>
                <Button size="sm" variant="default" onClick={() => excluirCupom(cupom.id)}>Excluir</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form onSubmit={salvarCupom} className="bg-white p-6 rounded shadow w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold mb-2">{editCupom ? 'Editar cupom' : 'Novo cupom'}</h2>
            <Input placeholder="Código" value={form.codigo} onChange={e => setForm((f: any) => ({ ...f, codigo: e.target.value }))} required />
            <Input placeholder="Desconto (%)" type="number" value={form.desconto} onChange={e => setForm((f: any) => ({ ...f, desconto: Number(e.target.value) }))} required />
            <Input placeholder="Validade (YYYY-MM-DD)" value={form.validade} onChange={e => setForm((f: any) => ({ ...f, validade: e.target.value }))} required />
            <Input placeholder="Máx. uso" type="number" value={form.max_uso} onChange={e => setForm((f: any) => ({ ...f, max_uso: Number(e.target.value) }))} required />
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


import { fetchRelatorioVendas, fetchMaisVendidos, fetchFaturamentoMensal, RelatorioVenda } from '../lib/relatorios';

export function AdminRelatoriosPage() {
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });
  const [relatorio, setRelatorio] = useState<RelatorioVenda[]>([]);
  const [maisVendidos, setMaisVendidos] = useState<RelatorioVenda[]>([]);
  const [faturamento, setFaturamento] = useState<RelatorioVenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarRelatorio() {
    setLoading(true);
    setErro(null);
    try {
      if (periodo.inicio && periodo.fim) {
        const data = await fetchRelatorioVendas(periodo);
        setRelatorio(data);
      }
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function carregarMaisVendidos() {
    setLoading(true);
    setErro(null);
    try {
      const data = await fetchMaisVendidos();
      setMaisVendidos(data);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function carregarFaturamento() {
    setLoading(true);
    setErro(null);
    try {
      const data = await fetchFaturamentoMensal();
      setFaturamento(data);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="mb-6"><h1 className="text-2xl font-bold">Admin Relatórios</h1><p className="text-choco-700/80">Relatórios de vendas, produtos e faturamento.</p></div>
      {erro && <div className="text-red-600">{erro}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Vendas por Período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input type="date" value={periodo.inicio} onChange={e => setPeriodo(p => ({ ...p, inicio: e.target.value }))} />
            <Input type="date" value={periodo.fim} onChange={e => setPeriodo(p => ({ ...p, fim: e.target.value }))} />
            <Button onClick={carregarRelatorio} disabled={loading || !periodo.inicio || !periodo.fim}>Buscar</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Data</th>
                  <th className="px-2 py-1">Total</th>
                  <th className="px-2 py-1">Produto</th>
                  <th className="px-2 py-1">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {relatorio.map((r, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1">{r.data}</td>
                    <td className="px-2 py-1">R$ {r.total?.toFixed(2)}</td>
                    <td className="px-2 py-1">{r.produto_id}</td>
                    <td className="px-2 py-1">{r.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={carregarMaisVendidos} disabled={loading}>Buscar</Button>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Produto</th>
                  <th className="px-2 py-1">Qtd</th>
                </tr>
              </thead>
              <tbody>
                {maisVendidos.map((r, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1">{r.produto_id}</td>
                    <td className="px-2 py-1">{r.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={carregarFaturamento} disabled={loading}>Buscar</Button>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1">Mês</th>
                  <th className="px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {faturamento.map((r, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1">{r.data}</td>
                    <td className="px-2 py-1">R$ {r.total?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
