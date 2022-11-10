import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateModuleDto } from './create-module.dto';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  @IsOptional()
  @ApiProperty({
    description:
      'Status of the module whether it is published or still in draft.',
  })
  isPublished?: boolean;
}
