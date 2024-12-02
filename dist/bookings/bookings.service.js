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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_service_1 = require("../stripe/stripe.service");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    constructor(prisma, stripeService) {
        this.prisma = prisma;
        this.stripeService = stripeService;
    }
    async create(hostId, data) {
        const service = await this.prisma.podcastService.findUnique({
            where: { id: data.serviceId },
            include: { influencer: true },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (!service.meetingTypes.includes(data.meetingType)) {
            throw new common_1.BadRequestException('Invalid meeting type for this service');
        }
        const host = await this.prisma.user.findUnique({
            where: { id: hostId },
        });
        if (!host.stripeCustomerId) {
            throw new common_1.BadRequestException('Please set up payment method first');
        }
        if (!service.influencer.stripeAccountId) {
            throw new common_1.BadRequestException('Influencer has not set up payments yet');
        }
        const booking = await this.prisma.booking.create({
            data: {
                hostId,
                influencerId: service.influencerId,
                serviceId: service.id,
                status: client_1.BookingStatus.PENDING,
                meetingType: data.meetingType,
                meetingTime: data.meetingTime,
                totalPrice: service.price,
            },
        });
        const paymentIntent = await this.stripeService.createPaymentIntent(service.price, host.stripeCustomerId, service.id, booking.id, service.influencer.stripeAccountId);
        await this.prisma.booking.update({
            where: { id: booking.id },
            data: { stripePaymentIntentId: paymentIntent.id },
        });
        return booking;
    }
    async findAll(userId, role) {
        const where = role === client_1.UserRole.HOST
            ? { hostId: userId }
            : { influencerId: userId };
        return this.prisma.booking.findMany({
            where,
            include: {
                host: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                influencer: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                service: true,
            },
            orderBy: { meetingTime: 'desc' },
        });
    }
    async findOne(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                host: true,
                influencer: true,
                service: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        if (booking.hostId !== userId && booking.influencerId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own bookings');
        }
        return booking;
    }
    async cancel(id, userId) {
        const booking = await this.findOne(id, userId);
        if (booking.status !== client_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Can only cancel pending bookings');
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.CANCELED },
        });
    }
    async complete(id, userId) {
        const booking = await this.findOne(id, userId);
        if (booking.influencerId !== userId) {
            throw new common_1.ForbiddenException('Only influencers can complete bookings');
        }
        if (booking.status !== client_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Can only complete confirmed bookings');
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.COMPLETED },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stripe_service_1.StripeService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map