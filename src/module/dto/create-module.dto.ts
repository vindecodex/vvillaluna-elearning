import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the module' })
  title: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Estimated time to go through the module’s content. This will be in minutes.',
  })
  duration: number;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Unique course identifier. The id of the course as a parent of the module',
  })
  courseId: number;
}
