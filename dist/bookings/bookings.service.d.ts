import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { Booking, UserRole } from '@prisma/client';
export declare class BookingsService {
    private prisma;
    private stripeService;
    constructor(prisma: PrismaService, stripeService: StripeService);
    create(hostId: string, data: {
        serviceId: string;
        meetingTime: Date;
        meetingType: 'IN_PERSON' | 'VIDEO';
    }): Promise<Booking>;
    findAll(userId: string, role: UserRole): Promise<({
        influencer: {
            id: string;
            name: string;
            profileImage: string;
        };
        host: {
            id: string;
            name: string;
            profileImage: string;
        };
        service: {
            id: string;
            rating: number | null;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            price: number;
            title: string;
            description: string;
            meetingTypes: import(".prisma/client").$Enums.MeetingType[];
            influencerId: string;
            stripePriceId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        influencerId: string;
        hostId: string;
        serviceId: string;
        status: import(".prisma/client").$Enums.BookingStatus;
        meetingType: import(".prisma/client").$Enums.MeetingType;
        meetingTime: Date;
        totalPrice: number;
        stripePaymentIntentId: string | null;
    })[]>;
    findOne(id: string, userId: string): Promise<Booking>;
    cancel(id: string, userId: string): Promise<Booking>;
    complete(id: string, userId: string): Promise<Booking>;
}
