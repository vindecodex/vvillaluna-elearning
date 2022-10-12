import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ContentQueryDto } from '../dto/content-query.dto';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { Content } from '../entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}
  async create(
    createContentDto: CreateContentDto,
    user: User,
  ): Promise<Content> {
    try {
      const { moduleId } = createContentDto;
      const content = this.contentRepo.create({
        ...createContentDto,
        module: { id: moduleId },
        author: { id: user.id },
      });
      await this.contentRepo.save(content);
      return content;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new BadRequestException('Module id doesn\t exist');
      throw e;
    }
  }

  async findAll(
    contentQueryDto: ContentQueryDto,
  ): Promise<ResponseList<Content>> {
    const { page = 1, limit = 5 } = contentQueryDto;
    const contents = await this.contentRepo.find({
      skip: page - 1,
      take: limit,
    });
    const totalCount = await this.contentRepo.count();
    return {
      data: contents,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Content | object> {
    const content = await this.contentRepo.findOne({ where: { id } });
    return content ? content : {};
  }

  async update(
    id: number,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    try {
      const content = await this.contentRepo.preload({
        id,
        ...updateContentDto,
      });
      if (!content) throw new NotFoundException('Content not found.');
      await this.contentRepo.save(content);
      return content;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Content already exist');
      throw e;
    }
  }

  async remove(id: number): Promise<void> {
    const { affected } = await this.contentRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Content not found.');
  }
}
