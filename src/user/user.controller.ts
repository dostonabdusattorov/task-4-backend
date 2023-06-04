import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@Serialize('addDtoLater')
@Controller('user')
export class UserController {
  constructor(private usersSer: UserService, private authSer: AuthService) {}
}
