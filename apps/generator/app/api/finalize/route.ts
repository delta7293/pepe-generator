import { db } from 'db';
import { createCanvas, loadImage } from 'canvas';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import pMap from 'p-map';

import handleServerError from '@/utils/handleServerError';

export async function POST(_: Request) {
  try {
    const pepes = await db.selectFrom('pepes').select(['id']).execute();

    const pepeTraits = await db
      .selectFrom('pepeTraits')
      .select(['id', 'index', 'pepeId', 'traitId', 'traitOptionId'])
      .where(
        'pepeId',
        'in',
        pepes.map((pepe) => pepe.id),
      )
      .execute();

    const traits = await db
      .selectFrom('traits')
      .select(['id', 'folder', 'name'])
      .where(
        'id',
        'in',
        pepeTraits.map((pepeTrait) => pepeTrait.traitId),
      )
      .execute();

    const traitOptions = await db
      .selectFrom('traitOptions')
      .select(['id', 'file', 'name', 'traitId'])
      .where(
        'traitId',
        'in',
        pepeTraits.map((pepeTrait) => pepeTrait.traitId),
      )
      .execute();

    const pepesWithTraits = pepes.map((pepe) => {
      const thisPepesTraits = pepeTraits
        .filter((pt) => pt.pepeId === pepe.id)
        .map((pt) => {
          const trait = traits.find((trait) => trait.id === pt.traitId)!;
          const option = traitOptions.find((option) => option.id === pt.traitOptionId)!;

          return {
            id: trait.id,
            index: pt.index,
            optionId: option.id,
            folder: trait.folder,
            file: option.file,
            name: trait.name,
            value: option.name,
          };
        })
        .sort((a, b) => a.index - b.index);

      return {
        id: pepe.id,
        traits: thisPepesTraits,
      };
    });

    const outDir = `./public/images/generated`;
    if (!existsSync(outDir)) {
      await mkdir(outDir);
    }

    const handleMap = async (pepe: {
      id: number;
      traits: Array<{
        id: number;
        optionId: number;
        folder: string;
        file: string;
        name: string;
        value: string;
      }>;
    }) => {
      const canvas = createCanvas(400, 400);
      const ctx = canvas.getContext('2d');

      for (let i = 0; i < pepe.traits.length; i++) {
        const trait = pepe.traits[i];

        const bg = await loadImage(join('public', 'images', 'traits', trait.folder, trait.file));
        ctx.drawImage(bg, 0, 0, bg.width, bg.height);
      }

      const buffer = canvas.toBuffer('image/png');

      if (!existsSync(`${outDir}/${pepe.id}`)) {
        await mkdir(`${outDir}/${pepe.id}`);
      }

      await writeFile(`${outDir}/${pepe.id}/${pepe.id}.png`, buffer);
      await writeFile(
        `${outDir}/${pepe.id}/${pepe.id}.json`,
        JSON.stringify(
          {
            name: `Pepe #${pepe.id}`,
            description: 'Pepe',
            image: `https://pepe.fun/pepes/${pepe.id}.png`,
            attributes: pepe.traits.map((trait) => ({
              name: trait.name,
              value: trait.value,
            })),
          },
          null,
          2,
        ),
      );
    };

    await pMap(pepesWithTraits, handleMap, { concurrency: 25 });

    return Response.json({});
  } catch (error) {
    return handleServerError(error);
  }
}
