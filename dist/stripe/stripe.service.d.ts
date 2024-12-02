import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class StripeService {
    private configService;
    private prisma;
    private stripe;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCustomer(userId: string, email: string): Promise<Stripe.Response<Stripe.Customer>>;
    createConnectedAccount(userId: string, email: string): Promise<Stripe.Response<Stripe.Account>>;
    createPaymentIntent(amount: number, customerId: string, serviceId: string, bookingId: string, influencerAccountId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
    createAccountLink(accountId: string): Promise<Stripe.Response<Stripe.AccountLink>>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handlePaymentSuccess;
    private handleAccountUpdate;
}
