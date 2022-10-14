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
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepo: Repository<Subject>,
  ) {}

  async findAll(
    subjectQueryDto: SubjectQueryDto,
  ): Promise<ResponseList<Subject>> {
    const { page = 1, limit = 5 } = subjectQueryDto;
    const subjects = await this.subjectRepo.find({
      skip: page - 1,
      take: limit,
      relations: { owner: true },
    });
    const totalCount = await this.subjectRepo.countBy({ isPublished: true });

    return {
      data: subjects,
      totalCount,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Subject | object> {
    const subject = await this.subjectRepo.findOne({
      where: { id },
      relations: { owner: true },
    });
    return subject ? subject : {};
  }

  async create(
    createSubjectDto: CreateSubjectDto,
    user: User,
  ): Promise<Subject> {
    try {
      const { title } = createSubjectDto;
      const subject = this.subjectRepo.create({
        title,
        owner: user,
      });

      await this.subjectRepo.save(subject);
      return subject;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      throw e;
    }
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    try {
      const subject = await this.subjectRepo.preload({
        id,
        ...updateSubjectDto,
      });

      if (!subject) throw new NotFoundException('Subject not found.');

      await this.subjectRepo.save(subject);

      return subject;
    } catch (e) {
      if (e.code === PostgresErrorCode.DUPLICATE)
        throw new BadRequestException('Title already exist');
      throw e;
    }
  }

  async delete(id: number): Promise<void> {
    const { affected } = await this.subjectRepo.delete(id);
    if (affected > 0) return;
    throw new NotFoundException('Subject not found.');
  }
}
