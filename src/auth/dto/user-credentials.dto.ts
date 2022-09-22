import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class UserCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  verifyPassword: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;
}
