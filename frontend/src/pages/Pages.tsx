import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart } from '../lib/cart'
import { getOrders, createOrder } from '../lib/orders'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../lib/products'
import { getAppConfig, updateAppConfig } from '../lib/app_config'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Select } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

// ============= HOME PAGE =============
export function HomePage() {
  const [config, setConfig] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    getAppConfig().then(setConfig)
    getProducts().then(setProducts)
  }, [])

  if (!config) return <div className="container mx-auto p-8">Carregando...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: config.primary_color }}>
          {config.hero_title}
        </h1>
        <p className="text-lg text-muted-foreground mb-6">{config.hero_subtitle}</p>
        <div className="flex gap-4 justify-center">
          <Button asChild style={{ backgroundColor: config.primary_color, color: '#fff', borderColor: config.primary_color }}>
            <Link to="/catalogo">{config.hero_button_primary}</Link>
          </Button>
          <Button variant="outline" asChild style={{ color: config.primary_color, borderColor: config.primary_color }}>
            <Link to="/pedidos">{config.hero_button_secondary}</Link>
          </Button>
        </div>
      </div>

      {/* Produtos em destaque */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">{config.products_section_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <Card key={product.id}>
              {product.image_url && (
                <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">R$ {(product.price_cents / 100).toFixed(2)}</p>
                <Button className="mt-2 w-full" style={{ backgroundColor: config.primary_color, color: '#fff', borderColor: config.primary_color }} onClick={() => addToCart({ id: product.id, name: product.name, price: product.price_cents / 100, quantity: 1 })}>
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============= CATÁLOGO PAGE =============
export function CatalogoPage() {
  const [products, setProducts] = useState<any[]>([])
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    getProducts().then(setProducts)
    getAppConfig().then(setConfig)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
            )}
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold">R$ {(product.price_cents / 100).toFixed(2)}</p>
              <Button className="mt-2 w-full" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price_cents / 100, quantity: 1 })}>
                Adicionar ao Carrinho
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============= CARRINHO PAGE =============
export function CarrinhoPage() {
  const [cart, setCart] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setCart(getCart())
  }, [])

  const updateQuantity = (id: string, quantity: number) => {
    updateCartItemQuantity(id, quantity)
    setCart(getCart())
  }

  const removeItem = (id: string) => {
    removeFromCart(id)
    setCart(getCart())
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-sm">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>Remover</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-right">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
            <Button className="mt-4" onClick={() => navigate('/checkout')}>Finalizar Compra</Button>
          </div>
        </>
      )}
    </div>
  )
}

// ============= CHECKOUT PAGE =============
export function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert('Carrinho vazio')
      return
    }

    setLoading(true)
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    createOrder({
      items: cart,
      total,
      status: 'received',
    })
    clearCart()
    navigate('/pedidos')
    setLoading(false)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>{item.name} x{item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <Button className="mt-4 w-full" onClick={handleConfirmOrder} disabled={loading}>
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============= PEDIDOS PAGE =============
export function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Pedido #{order.id}</CardTitle>
                <CardDescription>Data: {new Date(order.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Total: R$ {order.total.toFixed(2)}</p>
                <Badge>{order.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ============= PERFIL PAGE =============
export function PerfilPage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setName(data.user?.user_metadata?.name || '')
    })
  }, [])

  const handleSaveProfile = async () => {
    await supabase.auth.updateUser({ data: { name } })
    alert('Perfil atualizado!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </div>
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  )
}

// ============= LOGIN PAGE =============
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Não tem conta? <Link to="/cadastro" className="text-primary">Cadastre-se</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============= CADASTRO PAGE =============
export function CadastroPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    if (error) {
      setError(error.message)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Cadastrar</Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Já tem conta? <Link to="/login" className="text-primary">Faça login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ============= ADMIN LOGIN PAGE =============
export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }
    const { data: isAdmin } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', data.user?.id)
      .single()
    if (isAdmin) {
      navigate('/admin/dashboard')
    } else {
      setError('Acesso negado: você não é administrador')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Login Administrativo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Entrar como Admin</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// ============= ADMIN DASHBOARD =============
export function AdminDashboardPage() {
  const [config, setConfig] = useState<any>(null)
  useEffect(() => {
    getAppConfig().then(setConfig)
  }, [])
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Bem-vindo ao painel administrativo, {config?.logo_text || 'I Love Delicitas'}</p>
    </div>
  )
}

// ============= ADMIN PRODUTOS =============
export function AdminProdutosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', price_cents: 0, stock: 0, cores: [], tamanhos: [], image_url: '', category_id: '' })

  const loadProducts = () => getProducts().then(setProducts)
  useEffect(() => { loadProducts() }, [])

  const handleSave = async () => {
    if (editing) {
      await updateProduct(editing.id, form)
    } else {
      await createProduct(form as any)
    }
    setOpen(false)
    setEditing(null)
    setForm({ name: '', description: '', price_cents: 0, stock: 0, cores: [], tamanhos: [], image_url: '', category_id: '' })
    loadProducts()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => setOpen(true)}>Novo Produto</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>R$ {(p.price_cents / 100).toFixed(2)}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => { setEditing(p); setForm(p); setOpen(true); }}>Editar</Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => deleteProduct(p.id).then(loadProducts)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editing ? "Editar" : "Novo"} Produto</h2>
            <div className="space-y-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Preço (em centavos)</Label><Input type="number" value={form.price_cents} onChange={e => setForm({ ...form, price_cents: parseInt(e.target.value) })} /></div>
              <div><Label>Estoque</Label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave}>Salvar</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============= ADMIN PEDIDOS =============
export function AdminPedidosPage() {
  const [orders, setOrders] = useState<any[]>([])
  useEffect(() => { setOrders(getOrders()) }, [])
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(o => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
              <TableCell>R$ {o.total.toFixed(2)}</TableCell>
              <TableCell><Badge>{o.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============= ADMIN CATEGORIAS =============
export function AdminCategoriasPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>
      <p>Gerenciamento de categorias em desenvolvimento.</p>
    </div>
  )
}

// ============= ADMIN CUPONS =============
export function AdminCuponsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cupons</h1>
      <p>Gerenciamento de cupons em desenvolvimento.</p>
    </div>
  )
}

// ============= ADMIN RELATORIOS =============
export function AdminRelatoriosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
      <p>Relatórios em desenvolvimento.</p>
    </div>
  )
}

// ============= ADMIN CONFIGURACOES =============
export function AdminConfiguracoesPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('identidade')

  useEffect(() => {
    getAppConfig().then(c => { setConfig(c); setLoading(false) })
  }, [])

  const handleSave = async (updates: any) => {
    await updateAppConfig(updates)
    const newConfig = await getAppConfig()
    setConfig(newConfig)
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Configurações do App</h1>
      <div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded ${tab === 'identidade' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setTab('identidade')}>Identidade</button>
          <button className={`px-4 py-2 rounded ${tab === 'hero' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setTab('hero')}>Hero</button>
          <button className={`px-4 py-2 rounded ${tab === 'secoes' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setTab('secoes')}>Seções</button>
          <button className={`px-4 py-2 rounded ${tab === 'cores' ? 'bg-primary text-white' : 'bg-gray-200'}`} onClick={() => setTab('cores')}>Cores</button>
        </div>
        {tab === 'identidade' && (
          <div className="space-y-4 mt-4">
            <div><Label>Texto da Logo</Label><Input value={config.logo_text} onChange={e => handleSave({ logo_text: e.target.value })} /></div>
            <div><Label>URL da Logo</Label><Input value={config.logo_image_url || ''} onChange={e => handleSave({ logo_image_url: e.target.value })} /></div>
          </div>
        )}
        {tab === 'hero' && (
          <div className="space-y-4 mt-4">
            <div><Label>Título Hero</Label><Input value={config.hero_title} onChange={e => handleSave({ hero_title: e.target.value })} /></div>
            <div><Label>Subtítulo Hero</Label><Input value={config.hero_subtitle} onChange={e => handleSave({ hero_subtitle: e.target.value })} /></div>
            <div><Label>Botão Principal</Label><Input value={config.hero_button_primary} onChange={e => handleSave({ hero_button_primary: e.target.value })} /></div>
            <div><Label>Botão Secundário</Label><Input value={config.hero_button_secondary} onChange={e => handleSave({ hero_button_secondary: e.target.value })} /></div>
          </div>
        )}
        {tab === 'secoes' && (
          <div className="space-y-4 mt-4">
            <div><Label>Título Seção Produtos</Label><Input value={config.products_section_title} onChange={e => handleSave({ products_section_title: e.target.value })} /></div>
            <div><Label>Título Seção Categorias</Label><Input value={config.categories_section_title} onChange={e => handleSave({ categories_section_title: e.target.value })} /></div>
          </div>
        )}
        {tab === 'cores' && (
          <div className="space-y-4 mt-4">
            <div><Label>Cor Primária</Label><Input type="color" value={config.primary_color} onChange={e => handleSave({ primary_color: e.target.value })} /></div>
            <div><Label>Cor Secundária</Label><Input type="color" value={config.secondary_color} onChange={e => handleSave({ secondary_color: e.target.value })} /></div>
            <div><Label>Cor Destaque</Label><Input type="color" value={config.accent_color} onChange={e => handleSave({ accent_color: e.target.value })} /></div>
          </div>
        )}
      </div>
    </div>
  )
}
