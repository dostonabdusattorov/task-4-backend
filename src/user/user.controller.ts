import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { HttpStatusCodes } from 'src/constants';

@Serialize(UserDto)
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private usersSer: UserService) {}

  @Get('/')
  getAllUsers() {
    return this.usersSer.sendAllUsers();
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: string) {
    const user = await this.usersSer.findOne(+id);

    if (!user) {
      throw new NotFoundException(HttpStatusCodes.NotFound, {
        cause: new Error(HttpStatusCodes.NotFound),
      });
    }

    return user;
  }

  @Patch('/:id')
  async updateUserStatus(@Param('id') id: string) {
    try {
      return await this.usersSer.updateStatus(+id);
    } catch (error) {
      throw new NotFoundException(error.message, {
        cause: error,
      });
    }
  }

  @Delete('/:id')
  async deleteOneUser(@Param('id') id: string) {
    try {
      return await this.usersSer.deleteOneUser(+id);
    } catch (error) {
      throw new NotFoundException(error.message, {
        cause: error,
      });
    }
  }
}
