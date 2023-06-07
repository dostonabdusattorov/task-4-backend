import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpStatusCodes } from 'src/constants';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userSer: UserService,
    private jwtSer: JwtService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async signup(name: string, email: string, password: string) {
    const users = await this.userSer.find(email);
    if (users.length) {
      throw new BadRequestException(HttpStatusCodes.BadCredentials);
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    const user = await this.userSer.create(name, email, result);

    return user;
  }

  async signin(email: string, password: string): Promise<any> {
    const [user] = await this.userSer.find(email);

    if (!user) {
      throw new UnauthorizedException(HttpStatusCodes.Unauthorized);
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException(HttpStatusCodes.WrongCredentials);
    }

    if (!user.isActive) {
      throw new ForbiddenException(HttpStatusCodes.Forbidden);
    }
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const signedinUser = this.repo.create({
      ...user,
      lastLoginTime: new Date().toString(),
    });

    await this.repo.save(signedinUser);

    return {
      user: signedinUser,
      access_token: await this.jwtSer.signAsync({ ...signedinUser }),
    };
  }
}
