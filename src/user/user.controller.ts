import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
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

  @Get('/:id')
  async getOneUser(@Param('id') id: string) {
    const user = await this.usersSer.findOne(+id);

    if (!user) {
      throw new NotFoundException('User Not Found', {
        cause: new Error('User Not Found'),
      });
    }

    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    try {
      return await this.authSer.signup(body.name, body.email, body.password);
    } catch (error) {
      throw new BadRequestException(error.message, { cause: error });
    }
  }

  @Patch('/:id')
  async updateUserStatus(@Param('id') id: string) {
    try {
      return await this.usersSer.updateStatus(+id);
    } catch (error) {
      throw new NotFoundException(error.message, { cause: error });
    }
  }

  @Delete('/:id')
  async deleteOneUser(@Param('id') id: string) {
    try {
      return await this.usersSer.deleteOneUser(+id);
    } catch (error) {
      throw new NotFoundException(error.message, { cause: error });
    }
  }
}
