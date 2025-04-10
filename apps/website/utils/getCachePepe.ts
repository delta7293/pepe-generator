import NotFoundError from '@/errors/NotFoundError';
import { db, kv } from 'db';

export default async function getCachePepe(id: number) {
  const cache = await kv.get(`pepe-cache-mint:${id}`);
  if (cache) {
    return cache;
  }

  const pepe = await db
    .selectFrom('pepes')
    .select(['id', 'imageUrl'])
    .where('id', '=', id)
    .executeTakeFirst()!;

  if (!pepe) {
    throw new NotFoundError('Pepe not found.');
  }

  await kv.set(`pepe-cache-mint:${id}`, pepe);

  return pepe;
}
