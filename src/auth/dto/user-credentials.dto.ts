import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';
import { Role } from '../../authorization/enums/role.enum';
import { Column } from 'typeorm';
import { IsEqualTo } from '../../shared/validators/is-equal-to.validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email address of the user to be authenticated' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Password of the user to be authenticated' })
  password: string;

  @IsNotEmpty()
  @IsEqualTo('password')
  @ApiProperty({ description: 'Verify password' })
  verifyPassword: string;

  @IsNotEmpty()
  @IsIn(Object.values(Role))
  @ApiProperty({ description: 'Dedicated role to be registered.' })
  role: Role;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: 'First Name of the user to be registered' })
  firstName: string;

  @Column()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last Name of the user to be registered' })
  lastName: string;
}
