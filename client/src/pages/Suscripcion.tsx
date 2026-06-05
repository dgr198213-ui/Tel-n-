import React, { useState } from 'react';
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const PLANS = [
  {
    id: 'free',
    name: 'Gratis',
    price: '$0',
    description: 'Perfil básico',
    features: [
      { name: '1 foto de perfil', included: true },
      { name: 'Sin videos', included: false },
      { name: 'Sin analytics', included: false },
      { name: 'Sin prioridad', included: false },
    ],
    cta: 'Plan Actual',
    disabled: true,
  },
  {
    id: 'estandar',
    name: 'Estándar',
    price: '$9.99',
    period: '/mes',
    description: 'Perfil profesional',
    features: [
      { name: '3 fotos', included: true },
      { name: '1 video', included: true },
      { name: 'Analytics básico', included: true },
      { name: 'Sin prioridad', included: false },
    ],
    cta: 'Actualizar a Estándar',
    icon: Sparkles,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$24.99',
    period: '/mes',
    description: 'Máxima visibilidad',
    features: [
      { name: '3 fotos', included: true },
      { name: '3 videos', included: true },
      { name: 'Analytics avanzado', included: true },
      { name: 'Prioridad en búsqueda', included: true },
    ],
    cta: 'Actualizar a Premium',
    icon: Zap,
    featured: true,
  },
];

export default function Suscripcion() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const { data: artist } = trpc.artista.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createCheckoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data: any) => {
      if (data.url) {
        window.open(data.url, '_blank');
        toast.success('Redirigiendo a pago...');
      }
    },
    onError: (error: any) => {
      toast.error('Error al crear sesión de pago');
      console.error(error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleUpgrade = (plan: 'estandar' | 'premium') => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    setLoading(true);
    createCheckoutMutation.mutate({ plan });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Inicia sesión para continuar</h2>
          <p className="text-muted-foreground mb-6">
            Necesitas estar autenticado para ver los planes de suscripción
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
            <a href="/dashboard">← Volver</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Planes de Suscripción
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades y amplía tu alcance
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = artist?.planStatus === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative p-6 flex flex-col transition ${
                    plan.featured
                      ? 'border-accent ring-1 ring-accent/50 md:scale-105'
                      : ''
                  }`}
                >
                  {plan.featured && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Recomendado
                    </Badge>
                  )}

                  {Icon && (
                    <Icon className="w-8 h-8 text-accent mb-4" />
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check
                          className={`w-4 h-4 ${
                            feature.included
                              ? 'text-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                        <span
                          className={
                            feature.included
                              ? ''
                              : 'text-muted-foreground/50'
                          }
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    disabled={
                      plan.disabled ||
                      isCurrentPlan ||
                      loading ||
                      plan.id === 'free'
                    }
                    onClick={() => {
                      if (plan.id === 'estandar' || plan.id === 'premium') {
                        handleUpgrade(plan.id as 'estandar' | 'premium');
                      }
                    }}
                    variant={plan.featured ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {isCurrentPlan ? 'Plan Actual' : plan.cta}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Current Plan Info */}
          {artist && (
            <div className="mt-12 p-6 bg-card border border-border rounded-lg max-w-2xl mx-auto">
              <h4 className="font-bold mb-2">Tu Plan Actual</h4>
              <p className="text-muted-foreground">
                Estás en el plan <strong>{artist.planStatus}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Preguntas Frecuentes
          </h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Sí, puedes cambiar tu plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.',
              },
              {
                q: '¿Hay período de prueba?',
                a: 'Puedes comenzar con el plan gratis sin necesidad de tarjeta de crédito.',
              },
              {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe.',
              },
              {
                q: '¿Puedo cancelar mi suscripción?',
                a: 'Sí, puedes cancelar en cualquier momento desde tu panel de control.',
              },
            ].map((item, i) => (
              <div key={i}>
                <h4 className="font-bold mb-2">{item.q}</h4>
                <p className="text-muted-foreground text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
