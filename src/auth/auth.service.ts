import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/model/user.model';
import { TokenInfo } from './models/auth.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 로그인 토큰 발급
   * @param user
   * @param tokens
   * @returns
   */
  async makeTokens(user: UserModel, tokens?: TokenInfo) {
    try {
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
      // 토큰 만료 기간 설정 (기본값 7일)
      const accessExpiryDate = tokens?.expiry_date ?? 1000 * 60 * 60 * 24;
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: accessExpiryDate,
      });
      const refreshExpiryDate = tokens?.expiry_date ?? 1000 * 60 * 60 * 24 * 7;
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: refreshExpiryDate,
      });
      this.logger.log(`${user.email} 토큰 발급 완료`);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expiry_date: accessExpiryDate,
      };
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
  /**
   * 토큰 검증
   * @param token
   * @returns
   */
  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
