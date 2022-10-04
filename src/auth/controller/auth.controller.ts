import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../service/auth.service';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorators';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { ResponseObject } from 'src/shared/interfaces/response-object.interface';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() userCredentialsDto: UserCredentialsDto): Promise<User> {
    return this.authService.createUser(userCredentialsDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  authenticate(
    @Body() authenticateDto: AuthenticateDto,
  ): Promise<AuthResponse> {
    return this.authService.authenticate(authenticateDto);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Headers('authorization') token: string): Promise<ResponseObject> {
    return this.authService.logout(token);
  }

  @Get('password')
  requestResetPassword(@Query('email') email: string): Promise<ResponseObject> {
    return this.authService.requestResetPassword(email);
  }

  @Post('password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  resetPassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseObject> {
    return this.authService.resetPassword(user, resetPasswordDto);
  }

  @Get('signup/verification')
  @UseGuards(AuthGuard('jwt'))
  verifyUser(@GetUser() user: User): Promise<void> {
    return this.authService.verifyUser(user);
  }

  @Post('signup/verification')
  @HttpCode(200)
  resendVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ): Promise<void> {
    return this.authService.resendVerificationEmail(resendVerificationDto);
  }
}
