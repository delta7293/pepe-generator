import { db, kv } from 'db';
import { z } from 'zod';

import handleServerError from '@/utils/handleServerError';
import UnprocessableContentError from '@/errors/UnprocessableContentError';
import { getTraitsMap } from '@/utils/getTraitsMap';
import { getTraitOptionsMap } from '@/utils/getTraitOptionsMap';
import NotFoundError from '@/errors/NotFoundError';
import ConflictError from '@/errors/ConflictError';

const schema = z.object({
  tokenId: z.number({
    required_error: 'Token ID is required.',
  }),
});

export async function POST(request: Request) {
  try {
    throw new ConflictError('Spinning is over.');

    // const body = await request.json();
    // const result = schema.safeParse(body);

    // if (!result.success) {
    //   throw new UnprocessableContentError(result.error.errors[0].message);
    // }

    // const { tokenId } = result.data;

    // const traitsMap = await getTraitsMap();
    // const traitOptionsMap = await getTraitOptionsMap();

    // const token = await db
    //   .selectFrom('tokens')
    //   .select('pepeId')
    //   .where('id', '=', tokenId)
    //   .executeTakeFirst();

    // if (!token) {
    //   throw new NotFoundError('Token not found.');
    // }

    // const pepe = await db
    //   .selectFrom('pepes')
    //   .select(['id', 'imageUrl'])
    //   .where('id', '=', token.pepeId)
    //   .executeTakeFirst()!;

    // if (!pepe) {
    //   throw new NotFoundError('Pepe not found.');
    // }

    // const pepeTraits = await db
    //   .selectFrom('pepeTraits')
    //   .select(['id', 'imageUrl', 'index', 'traitId', 'traitOptionId'])
    //   .where('pepeId', '=', pepe.id)
    //   .execute();

    // const response = {
    //   id: pepe.id,
    //   imageUrl: pepe.imageUrl,
    //   isApproved: true,
    //   labels: [],
    //   metadata: '',
    //   traits: pepeTraits.map((trait) => ({
    //     id: trait.traitId,
    //     index: trait.index,
    //     optionId: trait.traitOptionId,
    //     folder: traitsMap[trait.traitId].folder,
    //     file: traitOptionsMap[trait.traitOptionId].file,
    //     imageUrl: trait.imageUrl,
    //     name: traitsMap[trait.traitId].name,
    //     value: traitOptionsMap[trait.traitOptionId].name,
    //   })),
    // };

    // return Response.json(response);
  } catch (error) {
    return handleServerError(error);
  }
}
