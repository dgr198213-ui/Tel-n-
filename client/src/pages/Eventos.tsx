import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Eventos() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: eventosData } = trpc.evento.list.useQuery({ limit: 12 });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold">TELÓN</h1>
          </div>

          <Button variant="ghost" asChild>
            <a href="/">← Volver</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Directorio de Eventos
            </h2>
            <p className="text-lg text-muted-foreground">
              Explora la agenda cultural
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar evento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {eventosData && eventosData.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventosData.map((evento) => (
                <Card
                  key={evento.id}
                  className="group cursor-pointer hover:border-accent/50 transition overflow-hidden"
                >
                  {evento.fotoPrincipal && (
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img
                        src={evento.fotoPrincipal}
                        alt={evento.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{evento.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {evento.descripcion}
                    </p>

                    <div className="space-y-2 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(evento.fecha).toLocaleDateString("es-AR")}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {evento.ubicacion}
                      </div>
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
                      <a href={`/eventos/${evento.id}`}>
                        Ver Detalles
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay eventos disponibles</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
