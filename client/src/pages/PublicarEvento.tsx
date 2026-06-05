import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, Calendar, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const eventoSchema = z.object({
  titulo: z.string().min(1, "Título requerido").max(255),
  descripcion: z.string().min(10, "Descripción muy corta").max(5000),
  ubicacion: z.string().min(1, "Ubicación requerida"),
  fecha: z.string().min(1, "Fecha requerida"),
  hora: z.string().min(1, "Hora requerida"),
  disciplinas: z.array(z.string()).min(1, "Al menos una disciplina"),
  fotoPrincipal: z.string().url("URL inválida").optional(),
  enlaceExterno: z.string().url("URL inválida").optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

const DISCIPLINAS_COMUNES = [
  "Danza",
  "Música",
  "Teatro",
  "Circo",
  "Acrobacias",
  "Performance",
  "Artes Visuales",
  "Otro",
];

export default function PublicarEvento() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([]);

  const createMutation = trpc.evento.create.useMutation({
    onSuccess: (data) => {
      toast.success("¡Evento publicado exitosamente!");
      // Redirect to event detail page
      window.location.href = `/eventos/${data.id}`;
    },
    onError: () => {
      toast.error("Error al publicar evento");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<any>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      ubicacion: "",
      fecha: "",
      hora: "",
      disciplinas: [],
      fotoPrincipal: "",
      enlaceExterno: "",
    },
  });

  const toggleDisciplina = (disciplina: string) => {
    setSelectedDisciplinas((prev) => {
      const updated = prev.includes(disciplina)
        ? prev.filter((d) => d !== disciplina)
        : [...prev, disciplina];
      setValue("disciplinas", updated);
      return updated;
    });
  };

  const onSubmit = async (data: EventoFormData) => {
    setIsLoading(true);
    try {
      // Combine date and time
      const dateTime = new Date(`${data.fecha}T${data.hora}`);

      if (selectedDisciplinas.length === 0) {
        toast.error("Selecciona al menos una disciplina");
        return;
      }

      await createMutation.mutateAsync({
        ...data,
        fecha: dateTime,
        disciplinas: selectedDisciplinas,
      } as any);
    } finally {
      setIsLoading(false);
    }
  };

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
            <a href="/eventos">← Volver</a>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Publicar Evento</h2>
          <p className="text-muted-foreground mb-8">
            Comparte tu evento con la comunidad TELÓN. Sin registro requerido.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Información Básica */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Información Básica</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título del Evento *</Label>
                  <Input
                    id="titulo"
                    {...register("titulo")}
                    placeholder="Ej: Festival de Danza Contemporánea 2026"
                    className="mt-2"
                  />
                  {errors.titulo && (
                    <p className="text-sm text-destructive mt-1">
                      {(errors.titulo as any).message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción *</Label>
                  <Textarea
                    id="descripcion"
                    {...register("descripcion")}
                    placeholder="Cuéntanos sobre tu evento..."
                    rows={5}
                    className="mt-2"
                  />
                  {errors.descripcion && (
                    <p className="text-sm text-destructive mt-1">
                      {(errors.descripcion as any).message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Detalles del Evento */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Detalles</h3>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      {...register("fecha")}
                      className="mt-2"
                    />
                    {errors.fecha && (
                      <p className="text-sm text-destructive mt-1">
                        {(errors.fecha as any).message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hora">Hora *</Label>
                    <Input
                      id="hora"
                      type="time"
                      {...register("hora")}
                      className="mt-2"
                    />
                    {errors.hora && (
                      <p className="text-sm text-destructive mt-1">
                        {(errors.hora as any).message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="ubicacion">Ubicación *</Label>
                  <Input
                    id="ubicacion"
                    {...register("ubicacion")}
                    placeholder="Ej: Teatro Nacional, Buenos Aires"
                    className="mt-2"
                  />
                  {errors.ubicacion && (
                    <p className="text-sm text-destructive mt-1">
                      {(errors.ubicacion as any).message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Disciplinas */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Disciplinas *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {DISCIPLINAS_COMUNES.map((disciplina) => (
                  <button
                    key={disciplina}
                    type="button"
                    onClick={() => toggleDisciplina(disciplina)}
                    className={`p-2 rounded-lg border transition ${
                      selectedDisciplinas.includes(disciplina)
                        ? "bg-accent text-accent-foreground border-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {disciplina}
                  </button>
                ))}
              </div>
              {errors.disciplinas && (
                <p className="text-sm text-destructive mt-2">
                  {(errors.disciplinas as any).message}
                </p>
              )}
              {selectedDisciplinas.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDisciplinas.map((d) => (
                    <Badge key={d} variant="secondary">
                      {d}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            {/* Media */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Media</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fotoPrincipal">Foto Principal</Label>
                  <Input
                    id="fotoPrincipal"
                    {...register("fotoPrincipal")}
                    placeholder="URL de la foto"
                    type="url"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Soporta JPG, PNG. Mínimo 800x600px
                  </p>
                </div>

                <div>
                  <Label htmlFor="enlaceExterno">Enlace Externo</Label>
                  <Input
                    id="enlaceExterno"
                    {...register("enlaceExterno")}
                    placeholder="URL para más información"
                    type="url"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ej: sitio web del evento, entradas, etc.
                  </p>
                </div>
              </div>
            </Card>

            {/* Info Box */}
            <Card className="p-4 bg-accent/10 border-accent/50">
              <p className="text-sm text-muted-foreground">
                ℹ️ Tu evento será revisado por nuestro equipo antes de publicarse.
                Esto generalmente toma menos de 24 horas.
              </p>
            </Card>

            {/* Submit */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading || createMutation.isPending}
                className="flex-1"
              >
                {isLoading ? "Publicando..." : "Publicar Evento"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href="/eventos">Cancelar</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
