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
import { EnrollmentModule } from 'src/enrollment-module/entities/enrollment-module.entity';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentQueryDto } from '../dto/enrollment-query.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentService } from '../service/enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @GetUser() user: User,
  ): Promise<Enrollment> {
    return this.enrollmentService.create(createEnrollmentDto, user);
  }

  @Get()
  findAll(@Query() enrollmentQueryDto: EnrollmentQueryDto) {
    return this.enrollmentService.findAll(enrollmentQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<EnrollmentModule> {
    return this.enrollmentService.update(+id, updateEnrollmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string): Promise<void> {
    return this.enrollmentService.delete(+id);
  }
}
