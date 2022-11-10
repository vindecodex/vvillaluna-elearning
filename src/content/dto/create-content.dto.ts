import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateContentDto {
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Unique module identifier. The id of the module where this content will be added.',
  })
  moduleId: number;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Content of the module. Could be texts, images, documents or links to videos, or websites..For images and documents the data type should be a file.',
  })
  content: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'This would help the frontend developers to know what to do with the value. Possible values are “text”, “image”, “video”, or “document”, “url”.',
  })
  type: string;
}
