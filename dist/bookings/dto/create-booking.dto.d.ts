import { MeetingType } from '@prisma/client';
export declare class CreateBookingDto {
    serviceId: string;
    meetingTime: Date;
    meetingType: MeetingType;
}
