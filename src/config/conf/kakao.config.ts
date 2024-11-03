import { registerAs } from '@nestjs/config';

export default registerAs('kakao', () => ({
  apiUrl: process.env.KAKAO_API_URL,
  restApiKey: process.env.KAKAO_REST_API_KEY,
  redirectUri: process.env.KAKAO_REDIRECT_URI,
}));
