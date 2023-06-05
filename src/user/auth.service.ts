import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userSer: UserService) {}

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
}
