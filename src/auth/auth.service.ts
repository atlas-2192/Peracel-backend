import * as bcrypt from 'bcrypt';
import ms from 'ms';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { TokenPayload } from './token-payload.interface';
import { RegisterType, Role } from 'src/users/dto/create-user.request';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(user: User, response: Response) {
    let currentUser = await this.usersService.getUser({
      email: user.email,
    });

    if (!currentUser) {
      const { id, email, firstName, lastName, role } = user;
      currentUser = await this.usersService.createUser({
        email,
        firstName,
        lastName,
        password: id.toString(),
        registerType: RegisterType.GOOGLE,
        role: role as Role,
      });
    }

    return this.login(currentUser, response);
  }

  login(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(
      expires.getMilliseconds() +
        ms(this.configService.getOrThrow<string>('JWT_EXPIRES_IN')),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires,
    });

    return { tokenPayload };
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      console.log('user =>', user);
      const authenticated = await bcrypt.compare(password, user.password);
      console.log('authenticated =>', authenticated);

      if (!authenticated) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
