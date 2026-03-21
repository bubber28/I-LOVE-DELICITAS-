import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAppConfig } from '../../lib/app_config'

type HeaderLink = {
  to: string
  label: string
}

interface SiteHeaderProps {
  links: HeaderLink[]
}

export function SiteHeader({ links }: SiteHeaderProps) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    getAppConfig().then(setConfig).catch(console.error)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          {config?.logo_image_url ? (
            <img
              src={config.logo_image_url}
              alt="Logo"
              style={{ height: 40, width: 'auto' }}
              className="max-h-12 object-contain"
            />
          ) : (
            <span className="text-xl font-bold">{config?.logo_text || 'I Love Delicitas'}</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm">
          <Link to="/carrinho" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Carrinho
          </Link>
        </Button>
      </div>
    </header>
  )
}
