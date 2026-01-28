/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Invalida todas as chaves de cache que começam com o prefixo especificado
   */
  async invalidateByPrefix(prefix: string): Promise<void> {
    const store = this.cacheManager.stores as any;

    if (!store) {
      console.warn('Cache store not available for invalidation');
      return;
    }

    try {
      // Tenta diferentes métodos para obter as chaves dependendo da implementação do store
      let keys: any = null;

      if (typeof store.keys === 'function') {
        keys = store.keys();
      } else if (typeof store.getKeys === 'function') {
        keys = store.getKeys();
      } else if (store instanceof Map) {
        keys = Array.from(store.keys());
      }

      // Se keys é uma Promise, aguardar
      if (keys instanceof Promise) {
        keys = await keys;
      }

      // Filtrar apenas strings válidas que começam com o prefixo
      const validKeys = Array.isArray(keys)
        ? keys.filter(
            (key): key is string =>
              typeof key === 'string' && key.startsWith(prefix),
          )
        : [];

      // Deletar todas as chaves encontradas
      if (validKeys.length > 0) {
        await Promise.all(validKeys.map(key => this.cacheManager.del(key)));
        console.log(
          `Cache invalidated: ${validKeys.length} keys with prefix "${prefix}"`,
        );
      } else {
        console.log(`No cache keys found with prefix "${prefix}"`);
      }
    } catch (error) {
      console.error('Error invalidating cache:', error);
      // Não lançar erro para não quebrar o fluxo principal
    }
  }

  /**
   * Invalida cache de schedules (todas as rotas relacionadas)
   */
  async invalidateSchedulesCache(): Promise<void> {
    await Promise.all([
      this.invalidateByPrefix('GET:/schedules'),
      this.invalidateByPrefix('GET:/schedules/allSchedules'),
      this.invalidateByPrefix('GET:/schedules/allActiveSchedules'),
    ]);
  }
}
