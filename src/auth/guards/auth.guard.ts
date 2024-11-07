import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return false;
    }

    try {
      const decoded = await this.authService.verifyToken(token);
      request.user = decoded;
      return true;
    } catch (e) {
      return false;
    }
  }
}
