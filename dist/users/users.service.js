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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async updateProfile(userId, data) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }
    async findInfluencers(searchParams = {}) {
        const { category, rating, priceRange } = searchParams;
        return this.prisma.user.findMany({
            where: {
                role: client_1.UserRole.INFLUENCER,
                rating: rating ? { gte: rating } : undefined,
                servicesOffered: {
                    some: {
                        AND: [
                            category ? { category } : {},
                            priceRange
                                ? {
                                    price: {
                                        gte: priceRange.min,
                                        lte: priceRange.max,
                                    },
                                }
                                : {},
                        ],
                    },
                },
            },
            include: {
                servicesOffered: true,
                reviewsReceived: true,
            },
        });
    }
    async getInfluencerProfile(influencerId) {
        const influencer = await this.prisma.user.findFirst({
            where: {
                id: influencerId,
                role: client_1.UserRole.INFLUENCER,
            },
            include: {
                servicesOffered: true,
                reviewsReceived: {
                    include: {
                        reviewer: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                    },
                },
            },
        });
        if (!influencer) {
            throw new common_1.NotFoundException(`Influencer with ID ${influencerId} not found`);
        }
        return influencer;
    }
    async getHostProfile(hostId) {
        const host = await this.prisma.user.findFirst({
            where: {
                id: hostId,
                role: client_1.UserRole.HOST,
            },
            include: {
                bookingsAsHost: {
                    include: {
                        service: true,
                        influencer: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                    },
                },
                reviewsGiven: {
                    include: {
                        receiver: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                            },
                        },
                    },
                },
            },
        });
        if (!host) {
            throw new common_1.NotFoundException(`Host with ID ${hostId} not found`);
        }
        return host;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map