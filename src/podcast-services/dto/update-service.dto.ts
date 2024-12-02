import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { MeetingType } from '@prisma/client';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(MeetingType, { each: true })
  @ArrayMinSize(1)
  meetingTypes?: MeetingType[];

  @IsOptional()
  @IsString()
  category?: string;
}