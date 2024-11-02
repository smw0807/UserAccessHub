import { registerAs } from '@nestjs/config';

export default registerAs('kakao', () => ({
  restApiKey: process.env.KAKAO_REST_API_KEY,
  redirectUri: process.env.KAKAO_REDIRECT_URI,
}));
