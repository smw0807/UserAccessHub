import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthKakaoService {
  private readonly logger = new Logger(AuthKakaoService.name);
  private restApiKey: string;
  private redirectUri: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.restApiKey = this.configService.get('kakao.restApiKey');
    this.redirectUri = this.configService.get('kakao.redirectUri');
  }

  // 카카오 로그인 URL 생성
  getKakaoAuthUrl() {
    return `https://kauth.kakao.com/oauth/authorize?client_id=${this.restApiKey}&redirect_uri=${this.redirectUri}&response_type=code&state=kakao`;
  }

  // 카카오 로그인 인증 토큰 발급
  async getKakaoAuthToken(code: string) {
    try {
      const url = 'https://kauth.kakao.com/oauth/token';
      const data = {
        grant_type: 'authorization_code',
        client_id: this.restApiKey,
        code,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const response = await this.httpService.axiosRef.post(url, data, {
        headers,
      });
      return response.data;
    } catch (e) {
      this.logger.error('getKakaoUser', e);
      throw new Error(e);
    }
  }
}
