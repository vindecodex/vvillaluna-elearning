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
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async createUser(userCredentialsDto: UserCredentialsDto) {
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

      await this.userRepo.save(user);

      await this.sendVerificationEmail(user);

      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new BadRequestException('User already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async verifyUser(user: User) {
    try {
      const _user = await this.userRepo.preload({
        ...user,
        isActive: true,
      });

      await this.userRepo.save(_user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async resendVerificationEmail(resendVerificationDto: ResendVerificationDto) {
    const { email } = resendVerificationDto;
    const user = await this.userRepo.findOneBy({ email });
    await this.sendVerificationEmail(user);
  }

  async sendVerificationEmail(user: User) {
    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const verificationToken = this.jwtService.sign(jwtPayload);
    await this.mailService.sendVerification(user, verificationToken);
  }
}
