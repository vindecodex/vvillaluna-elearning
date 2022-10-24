import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ResponseList } from 'src/shared/interfaces/response-list.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { Subject } from '../entities/subject.entity';
import { SubjectService } from '../service/subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  findAll(@Query() dto: SubjectQueryDto): Promise<ResponseList<Subject>> {
    return this.subjectService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Subject | object> {
    return this.subjectService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @GetUser() user: User,
  ): Promise<Subject> {
    return this.subjectService.create(createSubjectDto, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subjectService.delete(id);
  }
}
