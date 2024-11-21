import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Role } from 'src/users/dto/create-user.request';

@Injectable()
export class RoleValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(Role).includes(value)) {
      throw new BadRequestException('Invalid Role provided');
    }
    return value;
  }
}
