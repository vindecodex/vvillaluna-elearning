import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../authorization/enums/role.enum';
import { Column } from 'typeorm';

export class UserCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  verifyPassword: string;

  @IsNotEmpty()
  role: Role;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;
}
