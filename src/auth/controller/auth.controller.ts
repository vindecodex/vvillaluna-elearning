import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GetUser } from '../../decorators/get-user.decorators';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../service/auth.service';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.authService.createUser(userCredentialsDto);
  }

  @Post('login')
  @HttpCode(200)
  authenticate(
    @Body() authenticateDto: AuthenticateDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.authenticate(authenticateDto, response);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }

  @Get('password')
  requestResetPassword(@Query('email') email: string) {
    return this.authService.requestResetPassword(email);
  }

  @Post('password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  resetPassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @Get('signup/verification')
  @UseGuards(AuthGuard('jwt'))
  verifyUser(@GetUser() user: User) {
    return this.authService.verifyUser(user);
  }

  @Post('signup/verification')
  @HttpCode(200)
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto);
  }
}
