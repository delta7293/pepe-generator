import { createPublicClient, http } from 'viem';
import { shuffleArray } from '../utils/shuffleArray';
import { db, kv } from 'db';
import getChain from '../utils/getChain';
import PEPE_NFT_ABI from '../constants/PEPE_NFT_ABI';

const sdk = require('api')('@opensea/v2.0#hbu2zlsaz6n88');

export default async function setToken() {
  while (true) {
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

    console.log(max);

    const tokens = await db.selectFrom('tokens').select(['id', 'pepeId']).execute();

    const pepes = await db
      .selectFrom('pepes')
      .select(['id', 'imageUrl'])
      .where('isApproved', '=', true)
      .where('status', '=', 'active')
      .execute();

    const lockedPepesMap: Record<number, true> = {};
    const tokenIds: Record<number, true> = {};
    tokens.forEach((token) => {
      tokenIds[token.id] = true;
      lockedPepesMap[token.pepeId] = true;
    });

    for (let tokenId = 1; tokenId <= max; tokenId++) {
      if (tokenIds[tokenId]) {
        continue;
      }

      console.log(tokenId);

      const availablePepes = pepes.filter((pepe) => !lockedPepesMap[pepe.id]);

      console.log(availablePepes.length);

      const randomPepe = shuffleArray(availablePepes)[0];

      lockedPepesMap[randomPepe.id] = true;

      try {
        await db
          .insertInto('tokens')
          .values({
            id: tokenId,
            pepeId: randomPepe.id,
          })
          .execute();
      } catch (error) {
        console.log(error);
      }

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
    }

    await new Promise((res) => setTimeout(res, 3000));
  }
}

setToken();
