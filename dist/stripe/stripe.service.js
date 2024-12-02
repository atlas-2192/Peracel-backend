"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
let StripeService = class StripeService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(configService.get('stripe.secretKey'), {
            apiVersion: '2023-10-16',
        });
    }
    async createCustomer(userId, email) {
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
    async createConnectedAccount(userId, email) {
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
    async createPaymentIntent(amount, customerId, serviceId, bookingId, influencerAccountId) {
        return this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            customer: customerId,
            payment_method_types: ['card'],
            metadata: {
                serviceId,
                bookingId,
            },
            application_fee_amount: Math.round((amount * 0.1) * 100),
            transfer_data: {
                destination: influencerAccountId,
            },
        });
    }
    async createAccountLink(accountId) {
        const accountLink = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${this.configService.get('frontend.url')}/influencer/stripe/refresh`,
            return_url: `${this.configService.get('frontend.url')}/influencer/stripe/return`,
            type: 'account_onboarding',
        });
        return accountLink;
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.configService.get('stripe.webhookSecret');
        const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
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
    async handlePaymentSuccess(paymentIntent) {
        const { bookingId } = paymentIntent.metadata;
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: 'CONFIRMED' },
        });
    }
    async handleAccountUpdate(account) {
        if (account.charges_enabled) {
            const user = await this.prisma.user.findFirst({
                where: { stripeAccountId: account.id },
            });
            if (user) {
            }
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map