import { Pepe } from '@/stores/pepe';
import { shuffleArray } from './shuffleArray';

export default async function getPepe() {
  const pepe = await fetch(process.env.NEXT_PUBLIC_DATA_PEPES_URL!);
  const data = (await pepe.json()) as Pepe[];

  return shuffleArray(data)[0];
}
