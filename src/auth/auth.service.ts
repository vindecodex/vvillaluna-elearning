import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './providers/mail/mail.service';
import { JwtPayload } from './providers/jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async create(userCredentialsDto: UserCredentialsDto) {
    const { password, verifyPassword } = userCredentialsDto;
    if (password !== verifyPassword) {
      throw new BadRequestException('Password did not match');
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = this.userRepo.create({
        ...userCredentialsDto,
        password: hashedPassword,
        salt,
        isActive: false,
      });

      const jwtPayload: JwtPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      };

      const verificationToken = this.jwtService.sign(jwtPayload);

      await this.userRepo.save(user);
      await this.mailService.sendVerification(user, verificationToken);

      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException('User already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
