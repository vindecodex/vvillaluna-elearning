import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateSubjectDto } from './create-subject.dto';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @IsOptional()
  isPublished?: boolean;
}
