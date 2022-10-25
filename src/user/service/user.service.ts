import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from '../../shared/enums/error-code/postgres.enum';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { QueryOptionsDto } from 'src/shared/dto/query-options.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(dto: QueryOptionsDto): Promise<ResponseList<User>> {
    const { page, limit } = dto;
    const users = await this.userRepo.find({ skip: page - 1, take: limit });
    const totalCount = await this.userRepo.countBy({ isActive: true });
    return {
      data: users,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<User | object> {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      return user ? user : {};
    } catch (e) {
      if (e.code === PostgresErrorCode.INVALID_INPUT) {
        throw new BadRequestException('Invalid ID format provided');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
