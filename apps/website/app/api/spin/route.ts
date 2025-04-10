import { db, kv } from 'db';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import handleServerError from '@/utils/handleServerError';
import UnprocessableContentError from '@/errors/UnprocessableContentError';
import ConflictError from '@/errors/ConflictError';
import { shuffleArray } from '@/utils/shuffleArray';
import { getTraitsMap } from '@/utils/getTraitsMap';
import { getTraitOptionsMap } from '@/utils/getTraitOptionsMap';
import UnauthorizedError from '@/errors/UnauthorizedError';
import ForbiddenError from '@/errors/ForbiddenError';
import { createPublicClient, http } from 'viem';
import getChain from '@/utils/getChain';
import PEPE_NFT_ABI from '@/constants/PEPE_NFT_ABI';

const sdk = require('api')('@opensea/v2.0#hbu2zlsaz6n88');

const schema = z.object({
  address: z.string({
    required_error: 'Address is required.',
  }),
  tokenId: z.number({
    required_error: 'Token ID is required.',
  }),
});

const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      address: string;
    };
    return decoded;
  } catch (err) {}
};

export async function POST(request: Request) {
  try {
    throw new ConflictError('Spinning is over.');

    // const body = await request.json();
    // const result = schema.safeParse(body);

    // if (!result.success) {
    //   throw new UnprocessableContentError(result.error.errors[0].message);
    // }

    // const { address, tokenId } = result.data;

    // const addressLower = address.toLowerCase();

    // const accessToken = request.headers.get('authorization')?.replace(/Bearer\s+/i, '');

    // const jwt = verifyJwt(accessToken || '');
    // if (!jwt) {
    //   throw new UnauthorizedError();
    // }
    // if (jwt.address !== addressLower) {
    //   throw new ForbiddenError();
    // }

    // const currentSpins = await db
    //   .selectFrom('spins')
    //   .select('createdAt')
    //   .where('address', '=', addressLower)
    //   .orderBy('createdAt desc')
    //   .execute();

    // if (currentSpins.length && +new Date(currentSpins[0].createdAt) > Date.now() - 5000) {
    //   throw new ConflictError('Wait for cooldown period.');
    // }

    // const publicClient = createPublicClient({
    //   chain: getChain(),
    //   transport: http(),
    // });

    // const ownerOf = await publicClient.readContract({
    //   address:
    //     process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS!.toLowerCase() as `0x${string}`,
    //   functionName: 'ownerOf',
    //   args: [BigInt(tokenId)],
    //   abi: PEPE_NFT_ABI,
    // });

    // if ((ownerOf as string).toLowerCase() !== addressLower) {
    //   throw new ForbiddenError();
    // }

    // const pepes = await db
    //   .selectFrom('pepes')
    //   .select(['id', 'imageUrl'])
    //   .where('isApproved', '=', true)
    //   .where('status', '=', 'active')
    //   .execute();

    // const lockedPepes = await db.selectFrom('tokens').select('pepeId').execute();

    // const lockedPepesMap: Record<number, boolean> = {};
    // lockedPepes.forEach((lockedPepe) => {
    //   lockedPepesMap[lockedPepe.pepeId] = true;
    // });

    // const availablePepes = pepes.filter((pepe) => !lockedPepesMap[pepe.id]);

    // const randomPepe = shuffleArray(availablePepes)[0];

    // const pepeTraits = await db
    //   .selectFrom('pepeTraits')
    //   .select(['id', 'imageUrl', 'index', 'traitId', 'traitOptionId'])
    //   .where('pepeId', '=', randomPepe.id)
    //   .execute();

    // const traitsMap = await getTraitsMap();
    // const traitOptionsMap = await getTraitOptionsMap();

    // await db
    //   .updateTable('tokens')
    //   .set({
    //     pepeId: randomPepe.id,
    //   })
    //   .where('id', '=', tokenId)
    //   .execute();

    // await db
    //   .insertInto('spins')
    //   .values({
    //     address,
    //     pepeId: randomPepe.id,
    //   })
    //   .execute();

    // const response = {
    //   id: randomPepe.id,
    //   imageUrl: randomPepe.imageUrl,
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

    // try {
    //   sdk.auth(process.env.OPENSEA_API_KEY);
    //   sdk.server('https://api.opensea.io');
    //   await sdk.refresh_nft({
    //     chain: 'ethereum',
    //     address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS,
    //     identifier: tokenId,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // return Response.json(response);
  } catch (error) {
    return handleServerError(error);
  }
}
