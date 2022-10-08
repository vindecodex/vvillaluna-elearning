import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  verifyPassword: string;
}
