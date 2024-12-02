import { MeetingType } from '@prisma/client';
export declare class UpdateServiceDto {
    title?: string;
    description?: string;
    price?: number;
    meetingTypes?: MeetingType[];
    category?: string;
}
