import { IsString, IsDate, IsEnum } from 'class-validator';
import { MeetingType } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  serviceId: string;

  @IsDate()
  meetingTime: Date;

  @IsEnum(MeetingType)
  meetingType: MeetingType;
}