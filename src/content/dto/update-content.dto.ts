import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {
  @IsOptional()
  @ApiProperty({
    description:
      'Status of the content whether it is published or still in draft.',
  })
  isPublished?: boolean;
}
