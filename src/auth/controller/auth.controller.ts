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
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../service/auth.service';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { ResponseObject } from '../../shared/interfaces/response-object.interface';
import { LocalAuthGuard } from '../../shared/guards/local-auth.guard';
import { RequestResetPasswordDto } from '../dto/request-reset-password.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User Auth and Verification')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() dto: UserCredentialsDto): Promise<User> {
    return this.authService.createUser(dto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  authenticate(@Body() dto: AuthenticateDto): Promise<AuthResponse> {
    return this.authService.authenticate(dto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Headers('authorization') token: string): Promise<ResponseObject> {
    return this.authService.logout(token);
  }

  @Get('password')
  requestResetPassword(
    @Query() dto: RequestResetPasswordDto,
  ): Promise<ResponseObject> {
    return this.authService.requestResetPassword(dto.email);
  }

  @Post('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  resetPassword(
    @GetUser() user: User,
    @Body() dto: ResetPasswordDto,
  ): Promise<ResponseObject> {
    return this.authService.resetPassword(user, dto);
  }

  @Get('signup/verification')
  @UseGuards(JwtAuthGuard)
  verifyUser(@GetUser() user: User): Promise<void> {
    return this.authService.verifyUser(user);
  }

  @Post('signup/verification')
  @HttpCode(200)
  resendVerification(@Body() dto: ResendVerificationDto): Promise<void> {
    return this.authService.resendVerificationEmail(dto);
  }
}
