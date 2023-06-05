import {
  BadRequestException,
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SigninDto } from 'src/dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authSer: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    try {
      return await this.authSer.signup(body.name, body.email, body.password);
    } catch (error) {
      throw new BadRequestException(error.message, { cause: error });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authSer.signin(body.email, body.password);
  }
}
