import express from 'express';
import { 
  verifyWebhookSignature, 
  handleCheckoutSessionCompleted, 
  handleInvoicePaymentSucceeded, 
  handleSubscriptionDeleted 
} from './stripe';

export function registerStripeWebhook(app: express.Express) {
  // Use raw body for signature verification
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    const event = verifyWebhookSignature(req.body.toString(), signature);

    if (!event) {
      return res.status(400).send('Invalid webhook signature');
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event);
          break;
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event);
          break;
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event);
          break;
        default:
          console.log(`[Stripe] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error(`[Stripe] Error processing webhook ${event.type}:`, error);
      res.status(500).send('Internal server error');
    }
  });
}
