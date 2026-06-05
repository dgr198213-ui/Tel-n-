import React from 'react';
import { useRoute } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Share2, Mail, ExternalLink, Music, Sparkles, Crown, 
  Instagram, Facebook, Youtube, Globe 
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  website: <Globe className="w-5 h-5" />,
};

export default function ArtistaPublico() {
  const [, params] = useRoute("/artistas/:slug");
  const slug = params?.slug as string;

  const { data: artista, isLoading } = trpc.artista.bySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" asChild>
              <a href="/artistas">← Volver</a>
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="w-full aspect-square rounded-lg mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artista) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Artista no encontrado</h2>
          <p className="text-muted-foreground mb-6">
            El perfil que buscas no existe o ha sido eliminado
          </p>
          <Button asChild>
            <a href="/artistas">Volver al Directorio</a>
          </Button>
        </Card>
      </div>
    );
  }

  const isPremium = artista.planStatus === 'premium';
  const isEstandar = artista.planStatus === 'estandar';
  const canShowVideos = isPremium || isEstandar;

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
            <a href="/artistas">← Volver</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      {artista.fotoPrincipal && (
        <div className="relative h-64 md:h-96 overflow-hidden bg-muted">
          <img
            src={artista.fotoPrincipal}
            alt={artista.nombreArtistico}
            className="w-full h-full object-cover"
          />
          {isPremium && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-accent text-accent-foreground gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Profile Card */}
            <Card className="p-6 mb-6">
              {artista.fotoPrincipal && (
                <div className="relative mb-4 -mx-6 -mt-6 mb-4">
                  <img
                    src={artista.fotoPrincipal}
                    alt={artista.nombreArtistico}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
              )}

              <h1 className="text-2xl font-bold mb-2">{artista.nombreArtistico}</h1>

              {isEstandar && (
                <Badge variant="secondary" className="mb-4">
                  Estándar
                </Badge>
              )}

              <p className="text-sm text-muted-foreground mb-4">
                Miembro desde{' '}
                {new Date(artista.createdAt).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Eye className="w-4 h-4" />
                {artista.visitas} visitas
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="w-4 h-4" />
                  Contactar
                </Button>
                <Button variant="ghost" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir
                </Button>
              </div>
            </Card>

            {/* Social Links */}
            {artista.redesSociales && Object.keys(artista.redesSociales).length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4">Redes Sociales</h3>
                <div className="space-y-2">
                  {Object.entries(artista.redesSociales).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition"
                    >
                      {SOCIAL_ICONS[platform] || <ExternalLink className="w-4 h-4" />}
                      {platform}
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Bio */}
            {artista.bio && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Sobre mí</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {artista.bio}
                </p>
              </Card>
            )}

            {/* Photos */}
            {artista.fotosExtra && artista.fotosExtra.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Galería</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(artista.fotosExtra as string[]).map((foto, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg bg-muted group"
                    >
                      <img
                        src={foto}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Videos - Only for Estándar and Premium */}
            {canShowVideos && artista.enlacesVideo && artista.enlacesVideo.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Videos
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {(artista.enlacesVideo as string[]).map((video, i) => (
                    <div
                      key={i}
                      className="relative aspect-video bg-muted rounded-lg overflow-hidden"
                    >
                      <iframe
                        src={getEmbedUrl(video)}
                        title={`Video ${i + 1}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Premium Features Upsell */}
            {!canShowVideos && (
              <Card className="p-6 bg-accent/10 border-accent/50">
                <div className="flex items-start gap-4">
                  <Crown className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">Actualiza a Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ver videos y contenido exclusivo de este artista
                    </p>
                    <Button size="sm" asChild>
                      <a href="/suscripcion">Explorar Planes</a>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Convert video URL to embed URL
 */
function getEmbedUrl(url: string): string {
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('/').pop()
      : new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }

  // TikTok
  if (url.includes('tiktok.com')) {
    return url;
  }

  return url;
}

// Import Eye icon
import { Eye } from 'lucide-react';
