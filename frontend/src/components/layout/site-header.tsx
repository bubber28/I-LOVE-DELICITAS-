import { Menu, ShoppingBag } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useEffect, useState } from 'react';
import { getAppConfig } from '../../lib/app_config';

type HeaderLink = {
  to: string;
  label: string;
};

interface SiteHeaderProps {
  links: HeaderLink[];
}

export function SiteHeader({ links }: SiteHeaderProps) {
  const [config, setConfig] = useState<any>(null);
  useEffect(() => {
    getAppConfig().then(setConfig);
  }, []);
  return (
    <header className="sticky top-0 z-30 border-b border-choco-500/10 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            {config?.logo_image_url ? (
              <img
                src={config.logo_image_url}
                alt="Logo"
                style={{ height: 40, width: 'auto', maxHeight: 60 }}
                className="block max-h-14 max-w-[180px] object-contain"
              />
            ) : (
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-gradient-to-br from-blush-200 to-cream-200 text-lg font-bold text-choco-700">
                {config?.logo_text?.[0] || 'D'}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold tracking-tight text-choco-700">{config?.logo_text || 'I Love Delicitas'}</p>
              <p className="text-xs text-choco-700/70">Salgados e delícias com amor</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-cream-200 text-choco-700' : 'text-choco-700/80 hover:bg-cream-100'
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
                Conta
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/login">Entrar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/cadastro">Criar conta</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/perfil">Meu perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/login">Área do admin</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="default" size="sm">
            <Link to="/carrinho" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Carrinho
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden" aria-label="Abrir menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                {links.map((link) => (
                  <Button key={link.to} asChild variant="secondary" className="justify-start">
                    <NavLink to={link.to}>{link.label}</NavLink>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
