import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheInvalidationService } from './services/cache-invalidation.service';
import { HandlerCacheInterceptor } from './interceptors/cache.interceptor';

@Module({
  imports: [CacheModule.register()],
  providers: [CacheInvalidationService, HandlerCacheInterceptor],
  exports: [CacheModule, CacheInvalidationService, HandlerCacheInterceptor],
})
export class CommonModule {}
