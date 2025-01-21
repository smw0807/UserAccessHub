import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { Injectable } from '@nestjs/common';

import { CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGqlGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = GqlExecutionContext.create(context);
      const headers = ctx.getContext().req.headers;
      const authHeader = headers.authorization;
      const token = authHeader.split(' ')[1];

      const user = await this.authService.verifyToken(token);
      ctx.getContext().req.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
