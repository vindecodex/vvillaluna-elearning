import { AuthResponse } from './auth-response.interface';

export interface JwtPayload extends AuthResponse {
  iat?: number;
  exp?: number;
}
