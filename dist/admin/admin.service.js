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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalHosts, totalInfluencers, totalBookings, totalRevenue, recentBookings,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: client_1.UserRole.HOST } }),
            this.prisma.user.count({ where: { role: client_1.UserRole.INFLUENCER } }),
            this.prisma.booking.count(),
            this.prisma.booking
                .aggregate({
                where: { status: client_1.BookingStatus.COMPLETED },
                _sum: { totalPrice: true },
            })
                .then((result) => result._sum.totalPrice || 0),
            this.prisma.booking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    host: true,
                    influencer: true,
                    service: true,
                },
            }),
        ]);
        return {
            totalUsers,
            totalHosts,
            totalInfluencers,
            totalBookings,
            totalRevenue,
            recentBookings,
        };
    }
    async getAllUsers(role) {
        return this.prisma.user.findMany({
            where: role ? { role } : undefined,
            include: {
                servicesOffered: true,
                bookingsAsHost: true,
                bookingsAsInfluencer: true,
            },
        });
    }
    async getUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                servicesOffered: true,
                bookingsAsHost: true,
                bookingsAsInfluencer: true,
                reviewsReceived: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
    async updateUserStatus(userId, isActive) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive },
        });
    }
    async getBookings(status) {
        return this.prisma.booking.findMany({
            where: status ? { status } : undefined,
            include: {
                host: true,
                influencer: true,
                service: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async resolveDispute(bookingId, resolution) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${bookingId} not found`);
        }
        return booking;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map