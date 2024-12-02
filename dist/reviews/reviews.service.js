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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(reviewerId, data) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: data.bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== client_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Can only review completed bookings');
        }
        if (booking.hostId !== reviewerId && booking.influencerId !== reviewerId) {
            throw new common_1.ForbiddenException('You can only review your own bookings');
        }
        const receiverId = reviewerId === booking.hostId ? booking.influencerId : booking.hostId;
        const existingReview = await this.prisma.review.findFirst({
            where: {
                bookingId: data.bookingId,
                reviewerId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this booking');
        }
        const review = await this.prisma.review.create({
            data: {
                ...data,
                reviewerId,
                receiverId,
            },
        });
        await this.updateUserRating(receiverId);
        return review;
    }
    async findUserReviews(userId, asReceiver = true) {
        return this.prisma.review.findMany({
            where: asReceiver ? { receiverId: userId } : { reviewerId: userId },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
                booking: {
                    include: {
                        service: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateUserRating(userId) {
        const reviews = await this.prisma.review.findMany({
            where: { receiverId: userId },
            select: { rating: true },
        });
        if (reviews.length > 0) {
            const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
            await this.prisma.user.update({
                where: { id: userId },
                data: { rating: averageRating },
            });
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map