import getChain from '@/utils/getChain';
import { db } from 'db';
import { createPublicClient, defineChain, http, parseAbiItem } from 'viem';

async function mint() {
  const publicClient = createPublicClient({
    chain: getChain(),
    transport: http(),
  });

  const logs = await publicClient.getLogs({
    address:
      process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS!.toLowerCase() as `0x${string}`,
    event: parseAbiItem(
      'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    ),
    args: {
      from: '0x0000000000000000000000000000000000000000',
    },
    fromBlock: BigInt(0),
  });

  console.log(logs);

  const lockedPepes = await db.selectFrom('lockedPepes').select(['address', 'pepeId']).execute();

  const lockedPepesMap: Record<string, number> = {};
  lockedPepes.forEach((lockedPepe) => {
    lockedPepesMap[lockedPepe.address] = lockedPepe.pepeId;
  });

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

  console.log(lockedPepesMap[logs[0].args.to!]);

  setTimeout(mint, 5000);
}

mint();
