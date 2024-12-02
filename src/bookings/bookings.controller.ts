import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UserRole } from '@prisma/client';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.HOST)
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.bookingsService.findOne(id, req.user.id);
  }

  @Put(':id/cancel')
  async cancel(@Request() req, @Param('id') id: string) {
    return this.bookingsService.cancel(id, req.user.id);
  }

  @Put(':id/complete')
  @Roles(UserRole.INFLUENCER)
  async complete(@Request() req, @Param('id') id: string) {
    return this.bookingsService.complete(id, req.user.id);
  }
}