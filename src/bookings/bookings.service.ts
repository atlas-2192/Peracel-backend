import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { Booking, BookingStatus, UserRole } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async create(
    hostId: string,
    data: {
      serviceId: string;
      meetingTime: Date;
      meetingType: 'IN_PERSON' | 'VIDEO';
    },
  ): Promise<Booking> {
    const service = await this.prisma.podcastService.findUnique({
      where: { id: data.serviceId },
      include: { influencer: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.meetingTypes.includes(data.meetingType)) {
      throw new BadRequestException('Invalid meeting type for this service');
    }

    const host = await this.prisma.user.findUnique({
      where: { id: hostId },
    });

    if (!host.stripeCustomerId) {
      throw new BadRequestException('Please set up payment method first');
    }

    if (!service.influencer.stripeAccountId) {
      throw new BadRequestException('Influencer has not set up payments yet');
    }

    const booking = await this.prisma.booking.create({
      data: {
        hostId,
        influencerId: service.influencerId,
        serviceId: service.id,
        status: BookingStatus.PENDING,
        meetingType: data.meetingType,
        meetingTime: data.meetingTime,
        totalPrice: service.price,
      },
    });

    const paymentIntent = await this.stripeService.createPaymentIntent(
      service.price,
      host.stripeCustomerId,
      service.id,
      booking.id,
      service.influencer.stripeAccountId,
    );

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return booking;
  }

  async findAll(userId: string, role: UserRole) {
    const where = role === UserRole.HOST
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

  async findOne(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        host: true,
        influencer: true,
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    if (booking.hostId !== userId && booking.influencerId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending bookings');
    }

    // Add logic to handle refund through Stripe if needed

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELED },
    });
  }

  async complete(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    if (booking.influencerId !== userId) {
      throw new ForbiddenException('Only influencers can complete bookings');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Can only complete confirmed bookings');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.COMPLETED },
    });
  }
}