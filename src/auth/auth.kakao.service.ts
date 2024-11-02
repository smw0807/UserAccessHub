import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthKakaoService {
  private readonly logger = new Logger(AuthKakaoService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getKakaoAuthUrl() {
    const resApikey = this.configService.get('kakao.restApiKey');
    const redirectUrl = this.configService.get('kakao.redirectUri');
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${resApikey}&redirect_uri=${redirectUrl}&response_type=code&social=kakao`;
    return url;
  }
}
