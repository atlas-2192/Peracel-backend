import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsOptional()
  @IsString()
  googleId: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsOptional()
  password: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @IsEnum(Role, { message: 'Role must be either host or influencer' })
  role: Role;
}
