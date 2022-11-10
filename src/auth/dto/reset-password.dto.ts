import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsEqualTo } from '../../shared/validators/is-equal-to.validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The User’s new password' })
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  @ApiProperty({ description: 'Verify the User’s new password' })
  verifyPassword: string;
}
