import React, { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"artistas" | "eventos">("artistas");

  // Fetch artistas and eventos
  const { data: eventosData } = trpc.evento.list.useQuery({ limit: 6 });
  const { data: artistasData } = trpc.artista.bySlug.useQuery(
    { slug: searchQuery },
    { enabled: searchQuery.length > 0 && searchType === "artistas" }
  );

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm transition-smooth">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent animate-pulse-glow" />
            <h1 className="text-xl font-bold">TELÓN</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#artistas" className="text-sm hover:text-accent transition-smooth">
              Artistas
            </a>
            <a href="#eventos" className="text-sm hover:text-accent transition-smooth">
              Eventos
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard">Dashboard</a>
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <a href={getLoginUrl()}>Ingresar</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden animate-slide-up">
        {/* Stage lights background */}
        <div className="absolute inset-0 opacity-30 animate-fade-in">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Conecta con Artistas y Eventos
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Descubre talentos, promociona tu arte y gestiona tu presencia en la escena cultural.
            </p>
          </div>

          {/* Bifunctional Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2 mb-4">
              <Button
                variant={searchType === "artistas" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("artistas")}
              >
                <Users className="w-4 h-4 mr-2" />
                Artistas
              </Button>
              <Button
                variant={searchType === "eventos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("eventos")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Eventos
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={
                  searchType === "artistas"
                    ? "Buscar artista..."
                    : "Buscar evento..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Button size="lg" asChild>
                  <a href={getLoginUrl()}>
                    Crear Perfil de Artista
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#eventos">
                    Explorar Eventos
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <a href="/dashboard/perfil">
                    Mi Perfil
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/dashboard/eventos">
                    Crear Evento
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="eventos" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-2">Eventos Destacados</h3>
            <p className="text-muted-foreground">
              Descubre los próximos eventos en la escena cultural
            </p>
          </div>

          {eventosData && eventosData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosData.map((evento) => (
                <Card
                  key={evento.id}
                  className="group cursor-pointer hover:border-accent/50 transition-smooth overflow-hidden hover-lift"
                >
                  {evento.fotoPrincipal && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={evento.fotoPrincipal}
                        alt={evento.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold mb-2 line-clamp-2">{evento.titulo}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {evento.descripcion}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(evento.fecha).toLocaleDateString("es-AR")}
                    </div>

                    {evento.disciplinas && evento.disciplinas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(evento.disciplinas as string[]).slice(0, 2).map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a href={`/eventos/${evento.id}`}>Ver Detalles</a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay eventos disponibles en este momento</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <a href="/eventos">
                Ver Todos los Eventos
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold mb-2">¿Por qué TELÓN?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Visibilidad",
                description: "Crea tu perfil y sé descubierto por productores y públicos",
                icon: Sparkles,
              },
              {
                title: "Gestión",
                description: "Administra tus eventos, fotos y videos en un solo lugar",
                icon: Users,
              },
              {
                title: "Crecimiento",
                description: "Accede a planes premium para ampliar tu alcance",
                icon: ArrowRight,
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-6 text-center">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">TELÓN</h4>
              <p className="text-sm text-muted-foreground">
                Plataforma para artistas y promotores culturales
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#artistas" className="text-muted-foreground hover:text-accent">
                    Artistas
                  </a>
                </li>
                <li>
                  <a href="#eventos" className="text-muted-foreground hover:text-accent">
                    Eventos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    Términos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:info@telon.art" className="text-muted-foreground hover:text-accent">
                    info@telon.art
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 TELÓN. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
