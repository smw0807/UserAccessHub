import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/user/model/user.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {}

  // 이메일 로그인 토큰 발급
  async emailSignInToken(user: UserModel) {
    try {
      console.log('emailLogin : ', user);
      const payload = {
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
        type: user.type,
      };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      this.logger.error(e);
      throw new Error(e);
    }
  }
}
