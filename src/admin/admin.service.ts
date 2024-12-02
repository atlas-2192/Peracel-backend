import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, BookingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalHosts,
      totalInfluencers,
      totalBookings,
      totalRevenue,
      recentBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.HOST } }),
      this.prisma.user.count({ where: { role: UserRole.INFLUENCER } }),
      this.prisma.booking.count(),
      this.prisma.booking
        .aggregate({
          where: { status: BookingStatus.COMPLETED },
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

  async getAllUsers(role?: UserRole) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      include: {
        servicesOffered: true,
        bookingsAsHost: true,
        bookingsAsInfluencer: true,
      },
    });
  }

  async getUser(userId: string) {
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
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  async getBookings(status?: BookingStatus) {
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

  async resolveDispute(bookingId: string, resolution: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Implement dispute resolution logic here
    // This could include refunds, cancellations, or other actions

    return booking;
  }
}