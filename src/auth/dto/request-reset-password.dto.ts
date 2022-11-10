import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address used to uniquely identify the user',
  })
  email: string;
}
