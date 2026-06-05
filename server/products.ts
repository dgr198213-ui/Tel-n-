/**
 * Stripe Products Configuration for TELÓN Platform
 * Define subscription plans and their features
 */

export const STRIPE_PRODUCTS = {
  ESTANDAR: {
    name: "Plan Estándar",
    description: "Perfil profesional con multimedia",
    pricePerMonth: 9.99,
    features: {
      fotos: 3,
      videos: 1,
      analytics: true,
      priority: false,
    },
  },
  PREMIUM: {
    name: "Plan Premium",
    description: "Máxima visibilidad y herramientas",
    pricePerMonth: 24.99,
    features: {
      fotos: 3,
      videos: 3,
      analytics: true,
      priority: true,
    },
  },
};

export const PLAN_LIMITS = {
  free: {
    fotos: 1,
    videos: 0,
    analytics: false,
    priority: false,
  },
  estandar: STRIPE_PRODUCTS.ESTANDAR.features,
  premium: STRIPE_PRODUCTS.PREMIUM.features,
};

export type PlanType = 'free' | 'estandar' | 'premium';

export function getPlanFeatures(plan: PlanType) {
  return PLAN_LIMITS[plan];
}

export function getPlanPrice(plan: 'estandar' | 'premium'): number {
  if (plan === 'estandar') return STRIPE_PRODUCTS.ESTANDAR.pricePerMonth;
  if (plan === 'premium') return STRIPE_PRODUCTS.PREMIUM.pricePerMonth;
  return 0;
}
