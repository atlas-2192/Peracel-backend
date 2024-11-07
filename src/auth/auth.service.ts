import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
