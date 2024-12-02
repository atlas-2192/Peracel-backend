import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, createBookingDto: CreateBookingDto): Promise<{
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
    }>;
    findAll(req: any): Promise<({
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
    findOne(req: any, id: string): Promise<{
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
    }>;
    cancel(req: any, id: string): Promise<{
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
    }>;
    complete(req: any, id: string): Promise<{
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
    }>;
}
