import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImage: string | null;
        bio: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        googleId: string | null;
        stripeCustomerId: string | null;
        stripeAccountId: string | null;
        refreshToken: string | null;
        isActive: boolean;
    }>;
    updateProfile(req: any, updateData: {
        name?: string;
        bio?: string;
        profileImage?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImage: string | null;
        bio: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        googleId: string | null;
        stripeCustomerId: string | null;
        stripeAccountId: string | null;
        refreshToken: string | null;
        isActive: boolean;
    }>;
    findInfluencers(category?: string, rating?: number, minPrice?: number, maxPrice?: number): Promise<({
        servicesOffered: {
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
        }[];
        reviewsReceived: {
            id: string;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            reviewerId: string;
            receiverId: string;
            comment: string;
        }[];
    } & {
        id: string;
        email: string;
        password: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImage: string | null;
        bio: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        googleId: string | null;
        stripeCustomerId: string | null;
        stripeAccountId: string | null;
        refreshToken: string | null;
        isActive: boolean;
    })[]>;
    getInfluencerProfile(id: string): Promise<{
        servicesOffered: {
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
        }[];
        reviewsReceived: ({
            reviewer: {
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
        })[];
    } & {
        id: string;
        email: string;
        password: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImage: string | null;
        bio: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        googleId: string | null;
        stripeCustomerId: string | null;
        stripeAccountId: string | null;
        refreshToken: string | null;
        isActive: boolean;
    }>;
    getHostProfile(id: string): Promise<{
        bookingsAsHost: ({
            influencer: {
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
        })[];
        reviewsGiven: ({
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
        })[];
    } & {
        id: string;
        email: string;
        password: string | null;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        profileImage: string | null;
        bio: string | null;
        rating: number | null;
        createdAt: Date;
        updatedAt: Date;
        googleId: string | null;
        stripeCustomerId: string | null;
        stripeAccountId: string | null;
        refreshToken: string | null;
        isActive: boolean;
    }>;
}
