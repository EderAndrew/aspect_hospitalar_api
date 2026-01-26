import { Request } from 'express';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

export class HandlerCacheInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttl = 60 * 1000; //1 minute

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.buildCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      console.log('Cache HIT: ', cacheKey);
      return of(cached.data);
    }

    return next.handle().pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + this.ttl,
        });
        console.log('Cache SET: ', cacheKey);
      }),
    );
  }

  private buildCacheKey(request: Request): string {
    const userId = request.user?.id ?? 'anonymous';
    return `${request.method}:${request.originalUrl}:user:${userId}`;
  }
}
