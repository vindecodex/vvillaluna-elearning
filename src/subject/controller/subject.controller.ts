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
import { CreateSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/create-subject-policy.handler';
import { DeleteSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/delete-subject-policy.handler';
import { ReadSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/read-subject-policy.handler';
import { UpdateSubjectPolicyHandler } from 'src/authorization/policy-handler/subject/update-subject-policy.handler';
import { CheckPolicies } from 'src/shared/decorators/check-policies.decorator';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/shared/guards/policies.guard';
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
  @UseGuards(JwtAuthGuard)
  findAll(@Query() dto: SubjectQueryDto): Promise<ResponseList<Subject>> {
    return this.subjectService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadSubjectPolicyHandler)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
    return this.subjectService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateSubjectPolicyHandler)
  create(
    @Body() dto: CreateSubjectDto,
    @GetUser() user: User,
  ): Promise<Subject> {
    return this.subjectService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateSubjectPolicyHandler)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteSubjectPolicyHandler)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subjectService.delete(id);
  }
}
