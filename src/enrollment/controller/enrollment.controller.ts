import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateEnrollmentPolicyHandler } from '../../authorization/policy-handler/enrollment/create-enrollment-policy.handler';
import { DeleteEnrollmentPolicyHandler } from '../../authorization/policy-handler/enrollment/delete-enrollment-policy.handler';
import { ReadEnrollmentPolicyHandler } from '../../authorization/policy-handler/enrollment/read-enrollment-policy.handler';
import { UpdateEnrollmentPolicyHandler } from '../../authorization/policy-handler/enrollment/update-enrollment-policy.handler';
import { EnrollmentModule } from '../../enrollment-module/entities/enrollment-module.entity';
import { CheckPolicies } from '../../shared/decorators/check-policies.decorator';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { PoliciesGuard } from '../../shared/guards/policies.guard';
import { ResponseList } from '../../shared/interfaces/response-list.interface';
import { User } from '../../user/entities/user.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentService } from '../service/enrollment.service';

@ApiBearerAuth()
@ApiTags('Enrollment')
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(CreateEnrollmentPolicyHandler)
  create(
    @Body() dto: CreateEnrollmentDto,
    @GetUser() user: User,
  ): Promise<Enrollment> {
    return this.enrollmentService.create(dto, user);
  }

  @Get()
  findAll(@Query() dto: EnrollmentQueryDto): Promise<ResponseList<Enrollment>> {
    return this.enrollmentService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(ReadEnrollmentPolicyHandler)
  findOne(@Param('id') id: string): Promise<Enrollment> {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(UpdateEnrollmentPolicyHandler)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentModule> {
    return this.enrollmentService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(DeleteEnrollmentPolicyHandler)
  delete(@Param('id') id: string): Promise<void> {
    return this.enrollmentService.delete(+id);
  }
}
