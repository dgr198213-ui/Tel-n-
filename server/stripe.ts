import Stripe from 'stripe';
import { getDb, getArtistaByUserId, recordSuscripcionChange, upsertArtista } from './db';
import { STRIPE_PRODUCTS } from './products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

/**
 * Create a checkout session for subscription upgrade
 */
export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  plan: 'estandar' | 'premium',
  origin: string
) {
  const artist = await getArtistaByUserId(userId);

  // Get or create Stripe customer
  let customerId = artist?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
      metadata: {
        userId: userId.toString(),
        artistaId: artist?.id || '',
      },
    });
    customerId = customer.id;

    // Update artist with Stripe customer ID
    if (artist) {
      await upsertArtista({
        userId,
        nombreArtistico: artist.nombreArtistico,
        stripeCustomerId: customerId,
      });
    }
  }

  // Get price ID from environment or use test price
  const priceId = plan === 'estandar'
    ? process.env.STRIPE_PRICE_ESTANDAR || 'price_test_estandar'
    : process.env.STRIPE_PRICE_PREMIUM || 'price_test_premium';

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard/suscripcion?success=true`,
    cancel_url: `${origin}/dashboard/suscripcion?canceled=true`,
    allow_promotion_codes: true,
    metadata: {
      userId: userId.toString(),
      artistaId: artist?.id || '',
      plan,
    },
  });

  return session.url || '';
}

/**
 * Handle checkout.session.completed webhook
 */
export async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  if (!session.metadata?.userId || !session.metadata?.plan) {
    console.warn('[Stripe] Missing metadata in checkout session');
    return;
  }

  const userId = parseInt(session.metadata.userId);
  const plan = session.metadata.plan as 'estandar' | 'premium';
  const subscriptionId = session.subscription as string;

  // Get artist
  const artist = await getArtistaByUserId(userId);
  if (!artist) {
    console.warn(`[Stripe] Artist not found for user ${userId}`);
    return;
  }

  // Update artist with subscription info
  const oldPlan = artist.planStatus;
  await upsertArtista({
    userId,
    nombreArtistico: artist.nombreArtistico,
    planStatus: plan,
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: session.customer ? (session.customer as string) : undefined,
  });

  // Record subscription change
  await recordSuscripcionChange({
    artistaId: artist.id,
    planAnterior: oldPlan as any,
    planNuevo: plan,
    stripeEventId: event.id,
    razon: 'subscription_upgrade',
  });

  console.log(`[Stripe] Subscription created for artist ${artist.id}: ${plan}`);
}

/**
 * Handle invoice.payment_succeeded webhook
 */
export async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as any;

  const subscriptionId = invoice.subscription;
  if (!subscriptionId) {
    console.log('[Stripe] Invoice without subscription, skipping');
    return;
  }

  console.log(`[Stripe] Invoice paid for subscription ${subscriptionId}`);
}

/**
 * Handle customer.subscription.deleted webhook
 */
export async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  if (!subscription.metadata?.userId) {
    console.warn('[Stripe] Missing userId in subscription metadata');
    return;
  }

  const userId = parseInt(subscription.metadata.userId);
  const artist = await getArtistaByUserId(userId);

  if (!artist) {
    console.warn(`[Stripe] Artist not found for user ${userId}`);
    return;
  }

  // Downgrade to free plan
  const oldPlan = artist.planStatus;
  await upsertArtista({
    userId,
    nombreArtistico: artist.nombreArtistico,
    planStatus: 'free',
    stripeSubscriptionId: undefined,
  });

  // Record subscription change
  await recordSuscripcionChange({
    artistaId: artist.id,
    planAnterior: oldPlan as any,
    planNuevo: 'free',
    stripeEventId: event.id,
    razon: 'subscription_canceled',
  });

  console.log(`[Stripe] Subscription canceled for artist ${artist.id}`);
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error);
    return null;
  }
}
