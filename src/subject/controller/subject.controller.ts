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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSubjectPolicyHandler } from '../../authorization/policy-handler/subject/create-subject-policy.handler';
import { DeleteSubjectPolicyHandler } from '../../authorization/policy-handler/subject/delete-subject-policy.handler';
import { ReadSubjectPolicyHandler } from '../../authorization/policy-handler/subject/read-subject-policy.handler';
import { UpdateSubjectPolicyHandler } from '../../authorization/policy-handler/subject/update-subject-policy.handler';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { SubjectQueryDto } from '../dto/subject-query.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { Subject } from '../entities/subject.entity';
import { SubjectService } from '../service/subject.service';

@ApiBearerAuth()
@ApiTags('Subject')
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
