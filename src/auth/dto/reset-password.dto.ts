import { IsNotEmpty } from 'class-validator';
import { IsEqualTo } from '../../shared/validators/is-equal-to.validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  verifyPassword: string;
}
