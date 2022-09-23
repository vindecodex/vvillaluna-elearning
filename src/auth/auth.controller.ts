import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorators';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  createUser(@Body() userCredentialsDto: UserCredentialsDto) {
    return this.authService.createUser(userCredentialsDto);
  }

  @Get('signup/verification')
  @UseGuards(AuthGuard('jwt'))
  verifyAccount(@GetUser() user: User) {
    return this.authService.verifyUser(user);
  }

  @Post('signup/verification')
  resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
    return this.authService.resendVerificationEmail(resendVerificationDto);
  }
}
