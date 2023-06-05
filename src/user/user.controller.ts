import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';

@Serialize(UserDto)
@Controller('user')
export class UserController {
  constructor(private usersSer: UserService, private authSer: AuthService) {}

  @Get('/')
  getAllUsers() {
    return this.usersSer.sendAllUsers();
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    try {
      return await this.authSer.signup(body.name, body.email, body.password);
    } catch (error) {
      throw new BadRequestException(error.message, { cause: error });
    }
  }
}
