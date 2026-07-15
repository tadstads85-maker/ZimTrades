import { Controller, Post, Req, Res, Headers, Body, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' });
const prisma = new PrismaClient();

@Controller('webhooks')
export class StripeWebhookController {
  @Post('stripe')
  @HttpCode(200)
  async handleStripeWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') sig: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: Stripe.Event;

    try {
      const rawBody = (req as any).rawBody || '';
      event = webhookSecret ? stripe.webhooks.constructEvent(rawBody, sig, webhookSecret) : req.body;
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event types we care about
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string;
        // Update subscription status in DB
        try {
          await prisma.subscription.updateMany({ where: { stripeSubscriptionId: subId }, data: { status: 'active' } });
        } catch (err) {
          console.error('Failed to update subscription', err);
        }
        break;
      }
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        try {
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            create: {
              userId: '',
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              plan: subscription.items.data[0].price?.id || 'unknown',
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
            },
            update: {
              status: subscription.status,
              currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null
            }
          })
        } catch (err) {
          console.error('Failed to upsert subscription', err)
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
