import { ORDERED_TRAITS } from '@/constants/ORDERED_TRAITS';
import { loadTraits } from './loadTraits';

export const generateRandomTraits = async () => {
  const traits = await loadTraits();

  const pepeTraits: {
    index: number;
    folder: string;
    file: string;
    value: string;
  }[] = [];
  for (let i = 0; i < ORDERED_TRAITS.length; i++) {
    const category = ORDERED_TRAITS[i];

    const trait = traits.find((t) => t.folder === category)!;
    const random =
      trait.valuesWithBlanks[Math.floor(Math.random() * trait.valuesWithBlanks.length)];

    if (random === '') {
      continue;
    }

    pepeTraits.push({
      index: pepeTraits.length,
      folder: trait.folder,
      file: trait.options.find((o) => o.value === random)!.file,
      value: trait.options.find((o) => o.value === random)!.label,
      // value: trait.options.find((o) => o.value === random)!.value,
    });
  }

  return pepeTraits;
};
