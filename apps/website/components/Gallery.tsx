import 'react-loading-skeleton/dist/skeleton.css';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';

import PEPE_NFT_ABI from '@/constants/PEPE_NFT_ABI';
import { Pepe } from '@/stores/pepe';
import { createPublicClient, http } from 'viem';
import getChain from '@/utils/getChain';
import Clickable from './Clickable';
import { CircularProgress } from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';

export default function Gallery() {
  const { address } = useAccount();

  const balanceOf = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 5000,
    },
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [page, setPage] = useState(1);
  const [tokens, setTokens] = useState<(Pepe | null)[]>([]);

  useEffect(() => {
    if ((balanceOf.data as bigint) > BigInt(0)) {
      window.scrollTo(0, 0);

      setTokens(new Array(Number(balanceOf.data as bigint)).fill(null));

      async function loadContract() {
        const publicClient = createPublicClient({
          chain: getChain(),
          transport: http(),
        });

        const startIndex = (page - 1) * 12;
        const endIndex =
          Number(balanceOf.data as bigint) < startIndex + 12
            ? Number(balanceOf.data as bigint)
            : startIndex + 12;

        const requests: number[] = [];
        for (let i = 0; i < endIndex; i++) {
          requests.push(Number(balanceOf.data as bigint) - i - 1 - startIndex);
        }

        const tokensBigint = await Promise.all(
          requests.map(async (i) => {
            return publicClient.readContract({
              address:
                process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS!.toLowerCase() as `0x${string}`,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, BigInt(i)],
              abi: PEPE_NFT_ABI,
            });
          }),
        );

        const tokens = tokensBigint.map((t) => Number(t));

        const pepes = await Promise.all(
          tokens.map(async (token) => {
            return await axios({
              method: 'POST',
              url: '/api/getToken',
              data: {
                address,
                tokenId: token,
              },
            });
          }),
        );

        setTokens(
          pepes.map((pepe, index) => ({
            ...pepe.data,
            id: tokens[index],
          })),
        );

        setIsInitialized(true);
      }

      loadContract();
    }
  }, [balanceOf.data, page]);

  if (!balanceOf.data) {
    return <CircularProgress />;
  }

  return (
    <>
      <Link
        href="/"
        style={{
          position: 'fixed',
          left: 20,
          top: 40,
          zIndex: 20,
        }}
      >
        Go back home
      </Link>
      <div style={{ marginTop: 130, marginBottom: 150 }}>
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            justifyContent: 'center',
            margin: 0,
            padding: 0,
          }}
        >
          {tokens.map((token, tokenIndex) => (
            <li
              key={tokenIndex}
              style={{
                margin: 0,
                padding: 0,
                position: 'relative',
                height: 400,
                width: 400,
                overflow: 'hidden',
              }}
            >
              {!token && <Skeleton height={400} width={400} />}
              {token && (
                <Link href={`/pepes/${token.id}`}>
                  <img src="/images/blank.png" />
                  {token.traits.map((trait, traitIndex) => (
                    <img
                      key={`${traitIndex}`}
                      src={trait.imageUrl || `/images/traits/${trait.folder}/${trait.file}`}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                  ))}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div
          style={{
            background: 'rgba(0, 0, 0, .75)',
            borderRadius: 20,
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            padding: 20,
            position: 'fixed',
            bottom: 50,
            width: 200,
            left: `calc(50% - 100px)`,
          }}
        >
          <Clickable
            disabled={page < 2}
            onClick={() => setPage(page - 1)}
            style={{ color: 'white', width: 'auto' }}
          >
            &laquo;
          </Clickable>
          <input
            onChange={(e) => setPage(Number(e.target.value))}
            type="text"
            style={{ textAlign: 'center', width: 50 }}
            value={page}
          />
          <Clickable
            disabled={page > Math.ceil(Number((balanceOf.data as bigint) / BigInt(12)))}
            onClick={() => setPage(page + 1)}
            style={{ color: 'white', width: 'auto' }}
          >
            &raquo;
          </Clickable>
        </div>
      </div>
    </>
  );
}
