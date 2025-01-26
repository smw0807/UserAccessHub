import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = headers.authorization;

    try {
      const user = await this.authService.verifyToken(token);
      request.user = user;
      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('인증 토큰이 없습니다.');
    }
  }
}
