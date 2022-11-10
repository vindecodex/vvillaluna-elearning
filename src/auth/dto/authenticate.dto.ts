import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email address used to uniquely identify the user',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The user’s password',
  })
  password: string;
}
