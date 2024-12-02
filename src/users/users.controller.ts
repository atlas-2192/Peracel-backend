import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateData: { name?: string; bio?: string; profileImage?: string },
  ) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @Get('influencers')
  async findInfluencers(
    @Query('category') category?: string,
    @Query('rating') rating?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const searchParams: any = {};

    if (category) searchParams.category = category;
    if (rating) searchParams.rating = Number(rating);
    if (minPrice || maxPrice) {
      searchParams.priceRange = {
        min: minPrice ? Number(minPrice) : 0,
        max: maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER,
      };
    }

    return this.usersService.findInfluencers(searchParams);
  }

  @Get('influencers/:id')
  async getInfluencerProfile(@Param('id') id: string) {
    return this.usersService.getInfluencerProfile(id);
  }

  @Get('hosts/:id')
  @Roles(UserRole.ADMIN, UserRole.INFLUENCER)
  async getHostProfile(@Param('id') id: string) {
    return this.usersService.getHostProfile(id);
  }
}