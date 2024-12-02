import { MeetingType } from '@prisma/client';
export declare class CreateServiceDto {
    title: string;
    description: string;
    price: number;
    meetingTypes: MeetingType[];
    category: string;
}
