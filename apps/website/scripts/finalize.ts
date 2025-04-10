import { createPublicClient, http } from 'viem';
import getChain from '../utils/getChain';
import PEPE_NFT_ABI from '../constants/PEPE_NFT_ABI';
import { db } from 'db';
import { getTraitsMap } from '../utils/getTraitsMap';
import { getTraitOptionsMap } from '../utils/getTraitOptionsMap';
import { readFile, writeFile } from 'fs/promises';
import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import { existsSync } from 'fs';

export default async function setToken() {
  const rootDir = path.join(process.cwd(), '..', 'data', 'public');

  const publicClient = createPublicClient({
    chain: getChain(),
    transport: http(),
  });

  const totalSupply = await publicClient.readContract({
    address:
      process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS!.toLowerCase() as `0x${string}`,
    functionName: 'totalSupply',
    abi: PEPE_NFT_ABI,
  });

  const max = Number(totalSupply);

  const tokens = await db.selectFrom('tokens').select(['id', 'pepeId']).execute();

  const tokensMap: Record<
    number,
    {
      id: number;
      pepeId: number;
    }
  > = {};
  tokens.forEach((token) => {
    tokensMap[token.id] = token;
  });

  const allPepeTraits = await db
    .selectFrom('pepeTraits')
    .select(['id', 'imageUrl', 'pepeId', 'traitId', 'traitOptionId'])
    .orderBy('index asc')
    .execute();

  const pepeTraitsMap: Record<
    number,
    {
      id: number;
      imageUrl?: string | null;
      pepeId: number;
      traitId: number;
      traitOptionId: number;
    }[]
  > = {};
  allPepeTraits.forEach((pepeTrait) => {
    if (!pepeTraitsMap[pepeTrait.pepeId]) {
      pepeTraitsMap[pepeTrait.pepeId] = [];
    }
    pepeTraitsMap[pepeTrait.pepeId].push(pepeTrait);
  });

  const pepes = await db
    .selectFrom('pepes')
    .select(['id'])
    .where('isApproved', '=', true)
    .where('status', '=', 'active')
    .execute();

  const pepesMap: Record<
    number,
    {
      id: number;
    }
  > = {};
  pepes.forEach((pepe) => {
    pepesMap[pepe.id] = pepe;
  });

  const traitsMap = await getTraitsMap();
  const traitOptionsMap = await getTraitOptionsMap();

  for (let tokenId = max; tokenId > 0; tokenId--) {
    const metadataFile = `${rootDir}/metadata/${tokenId}`;
    const imageFile = `${rootDir}/pepes/${tokenId}.png`;

    // if (existsSync(metadataFile) && existsSync(imageFile)) {
    //   continue;
    // }

    const token = tokensMap[tokenId];
    if (!token) {
      throw new Error('Token not found');
    }

    const pepe = pepesMap[token.pepeId];
    if (!pepe) {
      throw new Error('Pepe not found');
    }

    const pepeTraits = pepeTraitsMap[pepe.id];
    if (!pepeTraits || !pepeTraits.length) {
      throw new Error('Pepe traits not found');
    }

    const metadata = {
      name: `Pepe #${token.id}`,
      description: `The Peplicator!\r\nhttps:\/\/www.peplicator.fun\/\r\nBy Matt Furie\r\n\r\nThe first generative NFT collection from the creator of Pepe The Frog\r\nEach NFT an original 1\/1 Pepe\r\n\r\nBrought to you by Chain\/Saw\r\nhttps:\/\/www.chainsaw.fun\/`,
      image: `https://pepe-data-2.vercel.app/pepes/${token.id}.png`,
      attributes: pepeTraits.map((trait) => ({
        trait_type: traitsMap[trait.traitId].name,
        value: traitOptionsMap[trait.traitOptionId].name,
      })),
    };

    await writeFile(metadataFile, JSON.stringify(metadata));

    const pepeTraitImages: (Buffer | string)[] = [];
    for (let i = 0; i < pepeTraits.length; i++) {
      const pepeTrait = pepeTraits[i];

      if (pepeTrait.imageUrl) {
        const response = await fetch(pepeTrait.imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        pepeTraitImages.push(buffer);
      } else {
        pepeTraitImages.push(
          path.join(
            process.cwd(),
            'public',
            'images',
            'traits',
            traitsMap[pepeTrait.traitId].folder,
            traitOptionsMap[pepeTrait.traitOptionId].file,
          ),
        );
      }
    }

    await sharp(path.join(rootDir, 'images', 'blank.png'))
      .composite(
        pepeTraitImages.map((pepeTraitImages) => ({
          input: pepeTraitImages,
        })),
      )
      .toFile(imageFile);

    console.log(metadata);
  }

  db.destroy();
}

setToken();
