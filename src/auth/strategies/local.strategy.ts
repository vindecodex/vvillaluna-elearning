import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const authenticateDto: AuthenticateDto = { email, password };
    const user = await this.authService.authenticate(authenticateDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
