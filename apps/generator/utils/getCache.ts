import { kv } from 'db';
import getCacheKey from './getCacheKey';

export default async function getCache(name: string, data: object) {
  const cacheKey = getCacheKey(name, data);
  const cache = await kv.get<{
    data: {
      count: number;
    };
    createdAt: number;
  }>(cacheKey);

  if (cache && cache.createdAt > Date.now() - 1000 * 60 * 5) {
    return cache.data;
  }
}
