import { UserResponse } from './user-response.interface';

export interface JwtPayload extends UserResponse {
  iat?: number;
  exp?: number;
}
