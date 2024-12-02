import { PrismaService } from '../prisma/prisma.service';
import { PodcastService, MeetingType } from '@prisma/client';
export declare class PodcastServicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(influencerId: string, data: {
        title: string;
        description: string;
        price: number;
        meetingTypes: MeetingType[];
        category: string;
    }): Promise<PodcastService>;
    findAll(filters: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        meetingType?: MeetingType;
    }): Promise<({
        influencer: {
            id: string;
            name: string;
            profileImage: string;
            rating: number;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<PodcastService>;
    update(id: string, influencerId: string, data: {
        title?: string;
        description?: string;
        price?: number;
        meetingTypes?: MeetingType[];
        category?: string;
    }): Promise<PodcastService>;
    delete(id: string, influencerId: string): Promise<void>;
}
