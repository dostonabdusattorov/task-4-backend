import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  lastLoginTime: string;

  @Expose()
  @IsString()
  registrationTime: string;

  @Expose()
  @IsBoolean()
  isActive: boolean;
}
