import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/model/user.model';
import { TokenInfo } from './models/auth.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  // 로그인 토큰 발급
  async makeTokens(user: UserModel, tokens?: TokenInfo) {
    try {
      console.log('emailLogin : ', user);
      const payload = {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
        type: user.type,
        profileImage: user.profileImage,
      };
      if (tokens) {
        payload['access_token'] = tokens.access_token;
        payload['refresh_token'] = tokens.refresh_token;
        payload['token_type'] = tokens.token_type;
      }
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: tokens?.expiry_date ?? '7d',
      });
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
}
