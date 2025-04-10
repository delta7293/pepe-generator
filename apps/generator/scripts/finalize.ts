import 'dotenv/config';
import { db, init } from 'db';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
// import sharp from 'sharp';

import { getAllTraitOptions } from '../utils/getAllTraitOptions';
import { getAllTraits } from '../utils/getAllTraits';
import { getTraitOptionsMap } from '../utils/getTraitOptionsMap';
import { getTraitsMap } from '../utils/getTraitsMap';
import { shuffleArray } from '../utils/shuffleArray';

init();

async function finalize() {
  const traitsMap = await getTraitsMap();
  const traitOptionsMap = await getTraitOptionsMap();

  const pepes = await db
    .selectFrom('pepes')
    .select(['id', 'imageUrl'])
    .where('isApproved', '=', true)
    .where('status', '!=', 'deleted')
    .execute();

  const pepeTraits = await db
    .selectFrom('pepeTraits')
    .select(['imageUrl', 'index', 'pepeId', 'traitId', 'traitOptionId'])
    .orderBy('index desc')
    .execute();

  const pepeTraitsMap: Record<
    number,
    Array<{
      imageUrl?: string | null;
      index: number;
      traitId: number;
      traitOptionId: number;
      name: string;
      value: string;
      folder: string;
      file: string;
    }>
  > = {};
  pepeTraits.forEach((pepeTrait) => {
    if (!pepeTraitsMap[pepeTrait.pepeId]) {
      pepeTraitsMap[pepeTrait.pepeId] = [];
    }
    pepeTraitsMap[pepeTrait.pepeId].push({
      imageUrl: pepeTrait.imageUrl,
      index: pepeTrait.index,
      traitId: pepeTrait.traitId,
      traitOptionId: pepeTrait.traitOptionId,
      name: traitsMap[pepeTrait.traitId].name,
      value: traitOptionsMap[pepeTrait.traitOptionId].name,
      folder: traitsMap[pepeTrait.traitId].folder,
      file: traitOptionsMap[pepeTrait.traitOptionId].file,
    });
  });

  const shuffledPepes = shuffleArray(pepes);

  const rootDir = path.join(process.cwd(), '..', 'website', 'public', 'pepes');
  if (!existsSync(rootDir)) {
    await mkdir(rootDir);
  }

  const pepesData: Array<{
    id: number;
    imageUrl?: string | null;
    isApproved: boolean;
    labels: string[];
    traits: Array<{
      id: number;
      index: number;
      optionId: number;
      folder: string;
      file: string;
      imageUrl?: string | null;
      name: string;
      value: string;
    }>;
  }> = [];

  while (shuffledPepes.length) {
    const slicedPepes = shuffledPepes.splice(0, 1000);

    console.log(`${shuffledPepes.length} remaining`);

    await Promise.all(
      slicedPepes.map(async (pepe, index) => {
        const id = index + 1;

        // const metadata = {
        //   name: `Pepe #${id}`,
        //   description: 'Pepe',
        //   image: `/pepes/${id}.png`,
        //   attributes: pepeTraitsMap[pepe.id].map((pepeTrait) => ({
        //     name: pepeTrait.name,
        //     value: pepeTrait.value,
        //   })),
        // };

        // const metadataFile = path.join(rootDir, `${id}-metadata.json`);
        // await writeFile(metadataFile, JSON.stringify(metadata, null, 2));

        const data = {
          id,
          imageUrl: pepe.imageUrl,
          isApproved: true,
          labels: [],
          // metadata: JSON.stringify(metadata, null, 2),
          traits: pepeTraitsMap[pepe.id].reverse().map((pepeTrait) => ({
            id: pepeTrait.traitId,
            index: pepeTrait.index,
            optionId: pepeTrait.traitOptionId,
            folder: pepeTrait.folder,
            file: pepeTrait.file,
            imageUrl: pepeTrait.imageUrl,
            name: pepeTrait.name,
            value: pepeTrait.value,
          })),
        };

        pepesData.push(data);

        // const dataFile = path.join(rootDir, `${id}.json`);
        // await writeFile(dataFile, JSON.stringify(data, null, 2));

        // const imageFile = path.join(rootDir, `${id}.png`);

        // await sharp(
        //   path.join(
        //     process.cwd(),
        //     'public',
        //     'images',
        //     'traits',
        //     pepeTraitsMap[pepe.id].slice(-1)[0].folder,
        //     pepeTraitsMap[pepe.id].slice(-1)[0].file,
        //   ),
        // )
        //   .composite(
        //     pepeTraitsMap[pepe.id]
        //       .reverse()
        //       .slice(0)
        //       .map((pepeTrait) => ({
        //         input: path.join(
        //           process.cwd(),
        //           'public',
        //           'images',
        //           'traits',
        //           pepeTrait.folder,
        //           pepeTrait.file,
        //         ),
        //       })),
        //   )
        //   .toFile(imageFile);
      }),
    );
  }

  const pepesFile = path.join(rootDir, `pepes.json`);

  await writeFile(pepesFile, JSON.stringify(pepesData, null, 2));

  const traits = await getAllTraits();
  const traitOptions = await getAllTraitOptions();

  const mappedTraits = traits.map((trait) => {
    const options = traitOptions.filter((option) => option.traitId === trait.id);
    return {
      id: trait.id,
      folder: trait.folder,
      name: trait.name,
      options: options.map((option) => ({
        id: option.id,
        file: option.file,
        name: option.name,
      })),
    };
  });

  const traitsFile = path.join(rootDir, `traits.json`);

  await writeFile(traitsFile, JSON.stringify(mappedTraits, null, 2));

  db.destroy();
}

finalize();
