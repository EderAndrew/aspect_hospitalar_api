/*import { Request } from 'express';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class HandlerCacheInterceptor implements NestInterceptor {
  private readonly defaultTtl = 60 * 1000; // 1 minuto

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.buildCacheKey(request);

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      console.log('Cache HIT: ', cacheKey);
      return of(cached);
    }

    return next.handle().pipe(
      tap(async data => {
        await this.cacheManager.set(cacheKey, data, this.defaultTtl);
        console.log('Cache SET: ', cacheKey);
      }),
    );
  }

  private buildCacheKey(request: Request): string {
    const userId = request.user?.id ?? 'anonymous';
    const queryString = new URLSearchParams(
      request.query as Record<string, string>,
    ).toString();
    const queryPart = queryString ? `?${queryString}` : '';

    return `${request.method}:${request.originalUrl}${queryPart}:user:${userId}`;
  }
}*/
