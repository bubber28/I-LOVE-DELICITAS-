import { Link } from 'react-router-dom';
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
  const products = [
    'Bolo Red Velvet',
    'Cheesecake de Frutas Vermelhas',
    'Mini Churros Gourmet',
    'Kit Festa para 6 pessoas'
  ];

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
        {products.map((product) => (
          <Card key={product}>
            <div className="h-40 rounded-t-2xl bg-gradient-to-br from-cream-200 to-blush-100" />
            <CardHeader>
              <CardTitle className="text-lg">{product}</CardTitle>
              <CardDescription>Imagem placeholder e descricao promocional.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="font-semibold text-choco-700">R$ 39,90</p>
              <Button size="sm">Adicionar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CarrinhoPage() {
  return (
    <section className="space-y-6">
      <PageIntro title="Carrinho" description="Resumo dos itens selecionados." />
      <Card>
        <CardHeader>
          <CardTitle>Seu pedido</CardTitle>
          <CardDescription>Confira antes de finalizar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>2x Caixa Mini Brownies</span>
            <span>R$ 49,80</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span>1x Bolo de Cenoura Premium</span>
            <span>R$ 32,90</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>R$ 82,70</span>
          </div>
          <Button asChild className="w-full">
            <Link to="/checkout">Ir para checkout</Link>
          </Button>
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
  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Login" description="Acesso de clientes e admins." />
      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Senha" type="password" />
          <Button className="w-full">Entrar</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export function CadastroPage() {
  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Cadastro" description="Criacao de nova conta." />
      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input placeholder="Nome completo" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Senha" type="password" />
          <Button className="w-full">Criar conta</Button>
        </CardContent>
      </Card>
    </section>
  );
}

export function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-lg space-y-6">
      <PageIntro title="Admin Login" description="Acesso administrativo (stub temporario)." />
      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Senha" type="password" />
          <Button className="w-full" type="button">
            Entrar no admin
          </Button>
          <p className="text-sm text-choco-700/80">
            Autenticacao admin ainda nao configurada. Conectaremos com Supabase Auth/Backend em seguida.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function AdminPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="space-y-6">
      <PageIntro title={title} description={description} />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Badge className="w-fit" variant="accent">
              Admin
            </Badge>
            <p className="text-sm text-choco-700/80">Visao lateral de modulos.</p>
            <Button variant="secondary" className="w-full justify-start">
              Pedidos
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Produtos
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              Relatorios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Painel</CardTitle>
            <CardDescription>Tabela em formato card, mantendo o fluxo atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
      </div>
    </section>
  );
}

export function AdminDashboardPage() {
  return <AdminPage title="Admin Dashboard" description="Visao geral da operacao." />;
}

export function AdminPedidosPage() {
  return <AdminPage title="Admin Pedidos" description="Gestao de pedidos da loja." />;
}

export function AdminProdutosPage() {
  return <AdminPage title="Admin Produtos" description="Cadastro e estoque de produtos." />;
}

export function AdminCategoriasPage() {
  return <AdminPage title="Admin Categorias" description="Organizacao do catalogo." />;
}

export function AdminCuponsPage() {
  return <AdminPage title="Admin Cupons" description="Regras promocionais e descontos." />;
}

export function AdminRelatoriosPage() {
  return <AdminPage title="Admin Relatorios" description="Indicadores de vendas e performance." />;
}
