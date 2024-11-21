import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Role {
  HOST = 'HOST',
  INFLUENCER = 'INFLUENCER',
}

export enum RegisterType {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export class CreateUserRequest {
  @IsNotEmpty()
  @IsEnum(RegisterType, {
    message: 'Register type must be either email or google',
  })
  registerType: RegisterType;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role, { message: 'Role must be either host or influencer' })
  role: Role;
}
