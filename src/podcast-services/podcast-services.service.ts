import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PodcastService, MeetingType, UserRole } from '@prisma/client';

@Injectable()
export class PodcastServicesService {
  constructor(private prisma: PrismaService) {}

  async create(
    influencerId: string,
    data: {
      title: string;
      description: string;
      price: number;
      meetingTypes: MeetingType[];
      category: string;
    },
  ): Promise<PodcastService> {
    const user = await this.prisma.user.findUnique({
      where: { id: influencerId },
    });

    if (!user || user.role !== UserRole.INFLUENCER) {
      throw new ForbiddenException('Only influencers can create services');
    }

    return this.prisma.podcastService.create({
      data: {
        ...data,
        influencerId,
      },
    });
  }

  async findAll(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    meetingType?: MeetingType;
  }) {
    const where: any = {};

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

  async findOne(id: string): Promise<PodcastService> {
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
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(
    id: string,
    influencerId: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      meetingTypes?: MeetingType[];
      category?: string;
    },
  ): Promise<PodcastService> {
    const service = await this.prisma.podcastService.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (service.influencerId !== influencerId) {
      throw new ForbiddenException('You can only update your own services');
    }

    return this.prisma.podcastService.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, influencerId: string): Promise<void> {
    const service = await this.prisma.podcastService.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    if (service.influencerId !== influencerId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.prisma.podcastService.delete({
      where: { id },
    });
  }
}