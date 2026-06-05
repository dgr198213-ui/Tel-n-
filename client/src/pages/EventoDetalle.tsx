import React from 'react';
import { useRoute } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Share2, ExternalLink, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function EventoDetalle() {
  const [, params] = useRoute("/eventos/:id");
  const eventoId = params?.id as string;

  const { data: evento, isLoading } = trpc.evento.byId.useQuery(
    { id: eventoId },
    { enabled: !!eventoId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" asChild>
              <a href="/eventos">← Volver</a>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <Skeleton className="w-full h-96 rounded-lg mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Evento no encontrado</h2>
          <p className="text-muted-foreground mb-6">
            El evento que buscas no existe o ha sido eliminado
          </p>
          <Button asChild>
            <a href="/eventos">Volver a Eventos</a>
          </Button>
        </Card>
      </div>
    );
  }

  const fecha = new Date(evento.fecha);
  const fechaFormato = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const horaFormato = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">TELÓN</h1>
          <Button variant="ghost" asChild>
            <a href="/eventos">← Volver</a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Hero Image */}
            {evento.fotoPrincipal && (
              <div className="relative h-96 rounded-lg overflow-hidden mb-8 bg-muted">
                <img
                  src={evento.fotoPrincipal}
                  alt={evento.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{evento.titulo}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-border/40">
              <div className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-accent" />
                <div>
                  <div className="font-semibold">{fechaFormato}</div>
                  <div className="text-sm text-muted-foreground">{horaFormato}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-accent" />
                <div className="font-semibold">{evento.ubicacion}</div>
              </div>
            </div>

            {/* Disciplines */}
            {evento.disciplinas && evento.disciplinas.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold mb-3">Disciplinas</h3>
                <div className="flex flex-wrap gap-2">
                  {(evento.disciplinas as string[]).map((d) => (
                    <Badge key={d} variant="secondary">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {evento.descripcion && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Descripción</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {evento.descripcion}
                </p>
              </div>
            )}

            {/* External Link */}
            {evento.enlaceExterno && (
              <Card className="p-6 bg-accent/10 border-accent/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold mb-1">Más información</h3>
                    <p className="text-sm text-muted-foreground">
                      Visita el sitio oficial del evento
                    </p>
                  </div>
                  <Button asChild>
                    <a
                      href={evento.enlaceExterno}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      Ir al Sitio
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Event Card */}
            <Card className="p-6 sticky top-24">
              {evento.fotoPrincipal && (
                <div className="relative mb-4 -mx-6 -mt-6 mb-4">
                  <img
                    src={evento.fotoPrincipal}
                    alt={evento.titulo}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold mb-4 line-clamp-2">
                {evento.titulo}
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border/40">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-accent" />
                  <div>
                    <div className="font-semibold">{fechaFormato}</div>
                    <div className="text-xs text-muted-foreground">{horaFormato}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-accent" />
                  <div className="font-semibold">{evento.ubicacion}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full gap-2">
                  <Users className="w-4 h-4" />
                  Registrarse
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
