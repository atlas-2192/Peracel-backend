import { PodcastServicesService } from './podcast-services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { MeetingType } from '@prisma/client';
export declare class PodcastServicesController {
    private podcastServicesService;
    constructor(podcastServicesService: PodcastServicesService);
    create(req: any, createServiceDto: CreateServiceDto): Promise<{
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
    }>;
    findAll(category?: string, minPrice?: number, maxPrice?: number, meetingType?: MeetingType): Promise<({
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
    findOne(id: string): Promise<{
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
    }>;
    update(req: any, id: string, updateServiceDto: UpdateServiceDto): Promise<{
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
    }>;
    delete(req: any, id: string): Promise<{
        message: string;
    }>;
}
