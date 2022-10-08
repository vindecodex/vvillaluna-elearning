import { IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @IsOptional()
  title: string;

  @IsOptional()
  isPublished: boolean;
}
