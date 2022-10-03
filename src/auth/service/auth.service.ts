import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { Request } from 'express';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { UserResponse } from '../interfaces/user-response.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { MailService } from '../../mail/mail.service';

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

  async authenticate(authenticateDto: AuthenticateDto) {
    const { email, password } = authenticateDto;
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive)
      throw new BadRequestException('User is not yet verified');

    const userResponseData: UserResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const jwtPayload: JwtPayload = { ...userResponseData };

    const accessToken = this.jwtService.sign(jwtPayload);

    return {
      accessToken,
      ...userResponseData,
    };
  }

  async logout(user: User, request: Request) {
    if (!user) throw new UnauthorizedException();
    request.logOut((err) => {
      if (err) throw new InternalServerErrorException();
    });
    request.session.cookie.maxAge = 0;
    return {
      status: 'success',
      message: "You've been logged out!",
    };
  }

  async resetPassword(_user: User, resetPasswordDto: ResetPasswordDto) {
    const { password, verifyPassword } = resetPasswordDto;
    if (password !== verifyPassword) {
      throw new BadRequestException('Verify password did not match');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepo.preload({
      ..._user,
      password: hashedPassword,
      salt,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    await this.userRepo.save(user);
    return { status: 'success' };
  }

  async requestResetPassword(email: string) {
    try {
      if (!email) throw new BadRequestException('Email not provided');
      const user = await this.userRepo.findOneBy({ email });
      if (!user) {
        await this.mailService.sendAccountNotFound(email);
        return;
      }

      const jwtPayload: Partial<JwtPayload> = {
        id: user.id,
      };

      const resetPasswordToken = this.jwtService.sign(jwtPayload);

      await this.mailService.sendResetPasswordLink(email, resetPasswordToken);
    } catch (e) {
      throw e;
    }
  }

  async verifyUser(_user: User) {
    try {
      const user = await this.userRepo.preload({
        ..._user,
        isActive: true,
      });

      await this.userRepo.save(user);
    } catch (e) {
      throw e;
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
      throw e;
    }
  }

  async sendVerificationEmail(user: User) {
    const jwtPayload: Partial<JwtPayload> = {
      id: user.id,
    };
    const verificationToken = this.jwtService.sign(jwtPayload);
    await this.mailService.sendVerification(user, verificationToken);
  }
}