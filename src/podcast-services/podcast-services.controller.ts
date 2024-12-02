import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PodcastServicesService } from './podcast-services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { MeetingType, UserRole } from '@prisma/client';

@Controller('podcast-services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PodcastServicesController {
  constructor(private podcastServicesService: PodcastServicesService) {}

  @Post()
  @Roles(UserRole.INFLUENCER)
  async create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    return this.podcastServicesService.create(req.user.id, createServiceDto);
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('meetingType') meetingType?: MeetingType,
  ) {
    return this.podcastServicesService.findAll({
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      meetingType,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.podcastServicesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.INFLUENCER)
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.podcastServicesService.update(id, req.user.id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(UserRole.INFLUENCER)
  async delete(@Request() req, @Param('id') id: string) {
    await this.podcastServicesService.delete(id, req.user.id);
    return { message: 'Service deleted successfully' };
  }
}