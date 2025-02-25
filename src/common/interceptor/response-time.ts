import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseTimeInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();
    let body = null;
    // GraqphQL 요청일 경우
    if (!request) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
      body = ctx.getContext().req.body;
    }
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        if (body) {
          this.logger.log(
            `${request.method} ${body.query} ${JSON.stringify(body.variables)} ${responseTime}ms`,
          );
        } else {
          this.logger.log(`${request.method} ${request.url} ${responseTime}ms`);
        }
      }),
    );
  }
}
