import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';

@Injectable()
export class UsersService {
  createUser(data: CreateUserRequest) {
    console.log('this is userdata', data);
  }
}
