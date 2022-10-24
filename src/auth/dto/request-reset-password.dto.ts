import { IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDto {
  @IsNotEmpty()
  email: string;
}
