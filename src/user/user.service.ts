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

  findOne(id: number) {
    return this.repo.findOneBy({ id });
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

  async updateStatus(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User Not Found');
    }

    const updatedUser = { ...user, isActive: !user.isActive };

    return this.repo.save(this.repo.create(updatedUser));
  }

  async deleteOneUser(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    } else {
      return this.repo.remove(user);
    }
  }
}
