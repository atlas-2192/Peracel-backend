import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { MeetingType } from '@prisma/client';

export class CreateServiceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsEnum(MeetingType, { each: true })
  @ArrayMinSize(1)
  meetingTypes: MeetingType[];

  @IsString()
  category: string;
}