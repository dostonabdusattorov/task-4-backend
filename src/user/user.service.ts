import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  create(name: string, email: string, password: string) {
    const registrationTime = new Date().toString();
    const user = this.repo.create({
      name,
      email,
      password,
      lastLoginTime: '',
      registrationTime,
    });

    return this.repo.save(user);
  }

  sendAllUsers() {
    return this.repo.find();
  }
}
