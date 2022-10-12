import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateContentDto {
  @IsPositive()
  @IsNotEmpty()
  moduleId: number;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  isPublished: boolean;
}
