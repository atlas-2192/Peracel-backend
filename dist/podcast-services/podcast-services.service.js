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
exports.PodcastServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PodcastServicesService = class PodcastServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(influencerId, data) {
        const user = await this.prisma.user.findUnique({
            where: { id: influencerId },
        });
        if (!user || user.role !== client_1.UserRole.INFLUENCER) {
            throw new common_1.ForbiddenException('Only influencers can create services');
        }
        return this.prisma.podcastService.create({
            data: {
                ...data,
                influencerId,
            },
        });
    }
    async findAll(filters) {
        const where = {};
        if (filters.category) {
            where.category = filters.category;
        }
        if (filters.minPrice || filters.maxPrice) {
            where.price = {
                gte: filters.minPrice || 0,
                lte: filters.maxPrice || Number.MAX_SAFE_INTEGER,
            };
        }
        if (filters.meetingType) {
            where.meetingTypes = {
                has: filters.meetingType,
            };
        }
        return this.prisma.podcastService.findMany({
            where,
            include: {
                influencer: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        rating: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const service = await this.prisma.podcastService.findUnique({
            where: { id },
            include: {
                influencer: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        rating: true,
                        bio: true,
                    },
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async update(id, influencerId, data) {
        const service = await this.prisma.podcastService.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        if (service.influencerId !== influencerId) {
            throw new common_1.ForbiddenException('You can only update your own services');
        }
        return this.prisma.podcastService.update({
            where: { id },
            data,
        });
    }
    async delete(id, influencerId) {
        const service = await this.prisma.podcastService.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        if (service.influencerId !== influencerId) {
            throw new common_1.ForbiddenException('You can only delete your own services');
        }
        await this.prisma.podcastService.delete({
            where: { id },
        });
    }
};
exports.PodcastServicesService = PodcastServicesService;
exports.PodcastServicesService = PodcastServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PodcastServicesService);
//# sourceMappingURL=podcast-services.service.js.map