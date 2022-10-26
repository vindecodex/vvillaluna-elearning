import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { Role } from '../../authorization/enums/role.enum';
import { Column } from 'typeorm';
import { IsEqualTo } from '../../shared/validators/is-equal-to.validator';

export class UserCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  verifyPassword: string;

  @IsNotEmpty()
  @IsIn(Object.values(Role))
  role: Role;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;
}
