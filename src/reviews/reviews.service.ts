import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review, BookingStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    reviewerId: string,
    data: {
      bookingId: string;
      rating: number;
      comment: string;
    },
  ): Promise<Review> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed bookings');
    }

    if (booking.hostId !== reviewerId && booking.influencerId !== reviewerId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Determine who is being reviewed
    const receiverId =
      reviewerId === booking.hostId ? booking.influencerId : booking.hostId;

    const existingReview = await this.prisma.review.findFirst({
      where: {
        bookingId: data.bookingId,
        reviewerId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    const review = await this.prisma.review.create({
      data: {
        ...data,
        reviewerId,
        receiverId,
      },
    });

    // Update user's average rating
    await this.updateUserRating(receiverId);

    return review;
  }

  async findUserReviews(userId: string, asReceiver = true) {
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

  private async updateUserRating(userId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { receiverId: userId },
      select: { rating: true },
    });

    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

      await this.prisma.user.update({
        where: { id: userId },
        data: { rating: averageRating },
      });
    }
  }
}