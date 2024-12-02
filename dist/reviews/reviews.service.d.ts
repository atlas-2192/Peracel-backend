import { PrismaService } from '../prisma/prisma.service';
import { Review } from '@prisma/client';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(reviewerId: string, data: {
        bookingId: string;
        rating: number;
        comment: string;
    }): Promise<Review>;
    findUserReviews(userId: string, asReceiver?: boolean): Promise<({
        booking: {
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
        };
        reviewer: {
            id: string;
            name: string;
            profileImage: string;
        };
        receiver: {
            id: string;
            name: string;
            profileImage: string;
        };
    } & {
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        reviewerId: string;
        receiverId: string;
        comment: string;
    })[]>;
    private updateUserRating;
}
