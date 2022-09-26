import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
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
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

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

  async login(loginDto: LoginDto, response: Response) {
    const { email, password } = loginDto;
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user.isActive)
      throw new BadRequestException('User is not yet verified');
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    const userResponseData: JwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const refreshToken = this.jwtService.sign({ id: user.id });
    const accessToken = this.jwtService.sign(userResponseData, {
      expiresIn: '30s',
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 3600 * 24 * 1000,
    });

    return {
      accessToken,
      ...userResponseData,
    };
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
    try {
      const { email } = resendVerificationDto;
      const user = await this.userRepo.findOneBy({ email });
      if (!user) {
        await this.mailService.sendAccountNotFound(email);
        return;
      }
      await this.sendVerificationEmail(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
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
