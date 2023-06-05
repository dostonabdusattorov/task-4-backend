import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userSer: UserService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async signup(name: string, email: string, password: string) {
    const users = await this.userSer.find(email);
    if (users.length) {
      throw new Error('email in use');
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
      throw new UnauthorizedException('Invalid email or password');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const lastLoginTime = new Date().toString();
    const signedinUser = this.repo.create({
      ...user,
      lastLoginTime,
    });

    return this.repo.save(signedinUser);
  }
}
