import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authSer: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    try {
      return await this.authSer.signup(body.name, body.email, body.password);
    } catch (error) {
      throw new BadRequestException(error.message, { cause: error });
    }
  }
}
