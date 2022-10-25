import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/shared/enums/error-code/postgres.enum';
import { buildQueryFrom } from 'src/shared/helpers/database/build-query-from.helper';
import { paginateBuilder } from 'src/shared/helpers/database/paginate-builder.helper';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ContentQueryDto } from '../dto/content-query.dto';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { Content } from '../entities/content.entity';
import { joinBuilder } from '../helpers/join-builder.helper';
import { sortBuilder } from '../helpers/sort-builder.helper';
import { whereBuilder } from '../helpers/where-builder.helper';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
  ) {}
  async create(dto: CreateContentDto, user: User): Promise<Content> {
    try {
      const { moduleId } = dto;
      const content = this.contentRepo.create({
        ...dto,
        module: { id: moduleId },
        author: { id: user.id },
      });
      await this.contentRepo.save(content);
      return content;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      if (e.code === PostgresErrorCode.INVALID_RELATION_KEY)
        throw new NotFoundException('Module id doesn\t exist');
      throw e;
    }
  }

  async findAll(dto: ContentQueryDto): Promise<ResponseList<Content>> {
    const { page, limit } = dto;
    const queryBuilder = this.contentRepo.createQueryBuilder('content');
    buildQueryFrom<Content, ContentQueryDto>(queryBuilder, dto).apply(
      joinBuilder,
      sortBuilder,
      whereBuilder,
      paginateBuilder,
    );

    const [contents, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data: contents,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Content | object> {
    const content = await this.contentRepo.findOne({
      where: { id },
      relations: { author: true },
    });
    return content ? content : {};
  }

  async update(id: number, dto: UpdateContentDto): Promise<Content> {
    try {
      const content = await this.contentRepo.preload({
        id,
        ...dto,
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

  async delete(id: number): Promise<void> {
    const { affected } = await this.contentRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Content not found.');
  }
}
