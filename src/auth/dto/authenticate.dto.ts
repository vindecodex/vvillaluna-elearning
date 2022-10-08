import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
