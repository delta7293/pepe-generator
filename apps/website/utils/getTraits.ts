import { Trait } from '@/stores/pepe';

export default async function getTraits() {
  const pepe = await fetch(`/pepes/traits.json`);
  const data = (await pepe.json()) as Trait[];

  return data;
}
