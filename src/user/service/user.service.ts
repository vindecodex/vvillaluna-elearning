import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(paginationQuerDto: PaginationQueryDto) {
    const { page = 1, limit = 5 } = paginationQuerDto;
    const users = await this.userRepo.find({ skip: page - 1, take: limit });
    const totalCount = await this.userRepo.countBy({ isActive: true });
    return {
      data: users,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      return user ? user : {};
    } catch (e) {
      if (e.code === '22P02') {
        throw new BadRequestException('Invalid ID format provided');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
