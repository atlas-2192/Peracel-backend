import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { User } from '@prisma/client';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { StateManagerService } from './state-manager.service';
import { RoleValidationPipe } from './pipes/role-validation.pipe';
import { Role } from 'src/users/dto/create-user.request';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
    private stateManagerService: StateManagerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth(@Query('role', RoleValidationPipe) role: Role) {
    console.log('google =>', role);
    const state = uuidv4();
    this.stateManagerService.setRole(state, role);
    return { state };
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/callback')
  async googleAuthCallback(
    @Query('state') state: string,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const role = this.stateManagerService.getRole(state);
      console.log('role => ', role);
      const { user } = req;
      const userWithRole = {
        ...user,
        role,
      };
      await this.authService.googleLogin(userWithRole, res);
      this.stateManagerService.clearState(state);
      res.redirect(this.configService.getOrThrow('FRONTEND_URL') + '/login');
    } catch (error) {
      console.error(error);
    }
  }
}
