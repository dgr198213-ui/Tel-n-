import React, { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  nombreArtistico: z.string().min(1, "Nombre requerido").max(255),
  bio: z.string().max(5000).optional(),
  fotoPrincipal: z.string().url("URL inválida").optional(),
  fotosExtra: z.array(z.string().url()).optional(),
  enlacesVideo: z.array(z.string().url()).optional(),
  redesSociales: z.record(z.string(), z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function PerfilArtista() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: artist } = trpc.artista.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateMutation = trpc.artista.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar perfil");
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(profileSchema),
    defaultValues: artist || {
      nombreArtistico: "",
      bio: "",
      fotoPrincipal: "",
      fotosExtra: [],
      enlacesVideo: [],
      redesSociales: {},
    },
  });

  const fotosExtra = (watch("fotosExtra") as string[]) || [];
  const enlacesVideo = (watch("enlacesVideo") as string[]) || [];

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await updateMutation.mutateAsync(data as ProfileFormData);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Inicia sesión</h2>
          <p className="text-muted-foreground mb-6">
            Necesitas estar autenticado para editar tu perfil
          </p>
          <Button asChild>
            <a href="/auth/login">Ingresar</a>
          </Button>
        </Card>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Editar Perfil</h2>
          <p className="text-muted-foreground mb-8">
            Actualiza tu información y contenido multimedia
          </p>

          {/* Plan Info */}
          {artist && (
            <Card className="p-4 mb-8 bg-card/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan Actual</p>
                  <p className="font-bold capitalize">{artist.planStatus}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/suscripcion">Cambiar Plan</a>
                </Button>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Información Básica */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Información Básica</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nombreArtistico">Nombre Artístico *</Label>
                  <Input
                    id="nombreArtistico"
                    {...register("nombreArtistico")}
                    placeholder="Tu nombre artístico"
                    className="mt-2"
                  />
                  {errors.nombreArtistico && (
                    <p className="text-sm text-destructive mt-1">
                      {typeof errors.nombreArtistico === 'object' && 'message' in errors.nombreArtistico
                        ? (errors.nombreArtistico as any).message
                        : 'Error'}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    placeholder="Cuéntanos sobre ti..."
                    rows={4}
                    className="mt-2"
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive mt-1">
                      {typeof errors.bio === 'object' && 'message' in errors.bio
                        ? (errors.bio as any).message
                        : 'Error'}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Fotos */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Fotos</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="fotoPrincipal">Foto Principal</Label>
                  <Input
                    id="fotoPrincipal"
                    {...register("fotoPrincipal")}
                    placeholder="URL de la foto principal"
                    type="url"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Fotos Adicionales</Label>
                  <div className="space-y-2 mt-2">
                    {fotosExtra.map((_, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          {...register(`fotosExtra.${i}`)}
                          placeholder={`URL foto ${i + 1}`}
                          type="url"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2 gap-2">
                    <Plus className="w-4 h-4" />
                    Agregar Foto
                  </Button>
                </div>
              </div>
            </Card>

            {/* Videos */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Soporta YouTube, Vimeo y TikTok
              </p>

              <div className="space-y-2">
                {enlacesVideo.map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      {...register(`enlacesVideo.${i}`)}
                      placeholder={`URL video ${i + 1}`}
                      type="url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        // Remove video
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2 gap-2">
                <Plus className="w-4 h-4" />
                Agregar Video
              </Button>
            </Card>

            {/* Redes Sociales */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Redes Sociales</h3>

              <div className="space-y-4">
                {["instagram", "facebook", "youtube", "website"].map((social) => (
                  <div key={social}>
                    <Label htmlFor={social} className="capitalize">
                      {social}
                    </Label>
                    <Input
                      id={social}
                      {...register(`redesSociales.${social}`)}
                      placeholder={`URL de ${social}`}
                      type="url"
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Submit */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading || updateMutation.isPending}
                className="flex-1"
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href="/">Cancelar</a>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
