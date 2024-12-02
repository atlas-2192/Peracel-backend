import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        reviewerId: string;
        receiverId: string;
        comment: string;
    }>;
    getUserReviews(userId: string, asReceiver?: boolean): Promise<({
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
}
