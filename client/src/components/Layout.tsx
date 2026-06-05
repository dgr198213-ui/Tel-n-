import { ReactNode } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

export function Layout({ children, hideHeader = false }: LayoutProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      {/* Stage Lights Background Effect */}
      <div className="fixed inset-0 stage-lights pointer-events-none z-0 opacity-40" />

      {/* Header */}
      {!hideHeader && (
        <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-6 h-16 bg-surface border-b border-border">
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <Link href="/">
              <a className="font-bold text-xl tracking-tighter text-primary hover:text-primary/80 transition-colors">
                TELÓN
              </a>
            </Link>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex gap-6">
              <Link href="/eventos">
                <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-5 border-b-2 border-transparent hover:border-border">
                  Directorio de Eventos
                </a>
              </Link>
              <Link href="/artistas">
                <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors py-5 border-b-2 border-transparent hover:border-border">
                  Directorio de Artistas
                </a>
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/eventos/publicar">
              <a>
                <Button
                  size="sm"
                  className="font-mono text-xs bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim glow-primary"
                >
                  Publicar Evento
                </Button>
              </a>
            </Link>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <a>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-xs hidden md:flex"
                  >
                    {user?.name || 'Dashboard'}
                  </Button>
                </a>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs hidden md:flex"
                >
                  Login/Registro
                </Button>
              </a>
            )}

            {/* Mobile Menu Trigger */}
            <button className="md:hidden text-foreground p-2 hover:bg-muted rounded transition-colors">
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow relative z-10 ${!hideHeader ? 'pt-16' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface/50 backdrop-blur-sm">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">TELÓN</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Conecta artistas con promotores
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Plataforma
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/artistas">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Artistas
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/eventos">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Eventos
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/eventos/publicar">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Publicar Evento
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/legal">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Privacidad
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/legal">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Términos
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contacto">
                    <a className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
                      Contacto
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-mono text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Síguenos
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono text-xs text-muted-foreground">
              © 2026 TELÓN. Todos los derechos reservados.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Hecho con ❤️ para artistas españoles
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
