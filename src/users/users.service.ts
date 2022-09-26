import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    const users = await this.userRepo.find();
    return {
      data: users,
      totalCount: 1,
      page: 1,
      limit: 5,
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      return { ...user };
    } catch (e) {
      if (e.code === '22P02') {
        throw new BadRequestException('Invalid ID format provided');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
