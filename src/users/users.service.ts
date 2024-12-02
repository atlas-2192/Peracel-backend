import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      bio?: string;
      profileImage?: string;
    },
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findInfluencers(
    searchParams: {
      category?: string;
      rating?: number;
      priceRange?: { min: number; max: number };
    } = {},
  ) {
    const { category, rating, priceRange } = searchParams;

    return this.prisma.user.findMany({
      where: {
        role: UserRole.INFLUENCER,
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

  async getInfluencerProfile(influencerId: string) {
    const influencer = await this.prisma.user.findFirst({
      where: {
        id: influencerId,
        role: UserRole.INFLUENCER,
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
      throw new NotFoundException(`Influencer with ID ${influencerId} not found`);
    }

    return influencer;
  }

  async getHostProfile(hostId: string) {
    const host = await this.prisma.user.findFirst({
      where: {
        id: hostId,
        role: UserRole.HOST,
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
      throw new NotFoundException(`Host with ID ${hostId} not found`);
    }

    return host;
  }
}