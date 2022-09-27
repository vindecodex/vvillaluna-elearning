import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
