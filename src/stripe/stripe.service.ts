import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.stripe = new Stripe(configService.get('stripe.secretKey'), {
      apiVersion: '2023-10-16',
    });
  }

  async createCustomer(userId: string, email: string) {
    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer;
  }

  async createConnectedAccount(userId: string, email: string) {
    const account = await this.stripe.accounts.create({
      type: 'express',
      email,
      metadata: {
        userId,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId: account.id },
    });

    return account;
  }

  async createPaymentIntent(
    amount: number,
    customerId: string,
    serviceId: string,
    bookingId: string,
    influencerAccountId: string,
  ) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        serviceId,
        bookingId,
      },
      application_fee_amount: Math.round((amount * 0.1) * 100), // 10% platform fee
      transfer_data: {
        destination: influencerAccountId,
      },
    });
  }

  async createAccountLink(accountId: string) {
    const accountLink = await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${this.configService.get('frontend.url')}/influencer/stripe/refresh`,
      return_url: `${this.configService.get('frontend.url')}/influencer/stripe/return`,
      type: 'account_onboarding',
    });

    return accountLink;
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('stripe.webhookSecret');
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'account.updated':
        await this.handleAccountUpdate(event.data.object);
        break;
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const { bookingId } = paymentIntent.metadata;
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });
  }

  private async handleAccountUpdate(account: Stripe.Account) {
    if (account.charges_enabled) {
      const user = await this.prisma.user.findFirst({
        where: { stripeAccountId: account.id },
      });
      if (user) {
        // Update user's stripe account status if needed
      }
    }
  }
}