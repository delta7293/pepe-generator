import { createPublicClient, http } from 'viem';
import getChain from '../utils/getChain';
import PEPE_NFT_ABI from '../constants/PEPE_NFT_ABI';

const sdk = require('api')('@opensea/v2.0#hbu2zlsaz6n88');

export default async function setToken() {
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

  for (let i = max; i > 0; i--) {
    console.log(i);

    try {
      sdk.auth(process.env.OPENSEA_API_KEY);
      sdk.server('https://api.opensea.io');
      await sdk.refresh_nft({
        chain: 'ethereum',
        address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS,
        identifier: i,
      });
    } catch (error) {
      console.log('error');

      i++;

      await new Promise((res) => setTimeout(res, 1000 * 80));
    }

    await new Promise((res) => setTimeout(res, 2000));
  }
}

setToken();
