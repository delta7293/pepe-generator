import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import PEPE_SALES_ABI from '@/constants/PEPE_SALES_ABI';
import PEPE_EDITIONS_ABI from '@/constants/PEPE_EDITIONS_ABI';
import { createPublicClient, formatEther, http, parseEther } from 'viem';
import QuantitySelector from '../QuantitySelector';
import Button from '../Button';
import DropDown from '../DropDown';
import ZOGZ_EDITIONS_ABI from '@/constants/ZOGZ_EDITIONS_ABI';
import HEDZ_ORIGINALS_ABI from '@/constants/HEDZ_ORIGINALS_ABI';
import PEPE_NFT_ABI from '@/constants/PEPE_NFT_ABI';
import GroupDropDown from '../GroupDropDown';
import getChain from '@/utils/getChain';
import axios from 'axios';
import { Pepe } from '@/stores/pepe';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface Props {
  onClose?: () => void;
}

const pepes = [
  {
    id: 1,
    image: '/images/editions/zogz.webp',
    name: 'ZOGZ Pepe',
    credits: 1,
  },
  {
    id: 3,
    image: '/images/editions/zogged_1.webp',
    name: 'ZOGGED Pepe',
    credits: 10,
  },
  {
    id: 2,
    image: '/images/editions/hedz.webp',
    name: 'HEDZ Pepe',
    credits: 50,
  },
  {
    id: 5,
    image: '/images/editions/rare.webp',
    name: 'RARE Pepe',
    credits: 500,
  },
  {
    id: 4,
    image: '/images/editions/pegzogz2.webp',
    name: 'PEGZOGZ Pepe',
    credits: 600,
  },
];

const zogz = new Array(111).fill('').map((_, index) => ({
  id: index + 1,
  image: `/images/zogz-thumbnails/zogz-thumbnail-${index + 1}.png`,
  name: `ZOGZ #${index + 1}`,
  credits: 1,
}));

export default function MintModal({ onClose }: Props) {
  const { address } = useAccount();

  const isSmall = useMediaQuery('(max-width:600px)');

  const mint = useWriteContract();

  const proof = useQuery({
    queryKey: ['proof', address],
    queryFn: async () => {
      const res = await axios({
        method: 'POST',
        url: '/api/getProof',
        data: {
          address,
        },
      });

      return res.data as {
        proof: string;
        root: string;
      };
    },
  });

  const hedzClaims = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_SALES_ABI,
    functionName: 'hedzClaims',
    args: [address],
    query: {
      refetchInterval: 5000,
    },
  });

  const mintLimit = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_NFT_ABI,
    functionName: 'mintLimit',
    query: {
      refetchInterval: 5000,
    },
  });

  const pepeIsApprovedForAll = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPE_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_EDITIONS_ABI,
    functionName: 'isApprovedForAll',
    args: [address, process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS],
    query: {
      refetchInterval: 5000,
    },
  });

  const pepeBalanceOfBatch = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPE_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_EDITIONS_ABI,
    functionName: 'balanceOfBatch',
    args: [new Array(5).fill(address), [1, 3, 2, 5, 4]],
    query: {
      refetchInterval: 5000,
    },
  });

  const zogzBalanceOfBatch = useReadContract({
    address: process.env.NEXT_PUBLIC_ZOGZ_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: ZOGZ_EDITIONS_ABI,
    functionName: 'balanceOfBatch',
    args: [
      new Array(111).fill(address),
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94,
        95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
      ],
    ],
    query: {
      refetchInterval: 5000,
    },
  });

  const zogzIsApprovedForAll = useReadContract({
    address: process.env.NEXT_PUBLIC_ZOGZ_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: ZOGZ_EDITIONS_ABI,
    functionName: 'isApprovedForAll',
    args: [address, process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS],
    query: {
      refetchInterval: 5000,
    },
  });

  const burnForCredits = useWriteContract();
  const setApprovalForAll = useWriteContract();

  const hedzBalanceOf = useReadContract({
    address: process.env.NEXT_PUBLIC_HEDZ_ORIGINALS_CONTRACT_ADDRESS as `0x${string}`,
    abi: HEDZ_ORIGINALS_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 5000,
    },
  });

  const [dialogType, setDialogType] = useState<'' | 'mint' | 'burn' | 'owner' | 'hedzOwner'>('');
  const [burnQuantity, setBurnQuantity] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedEdition, setSelectedEdition] = useState('');
  const [tokens, setTokens] = useState<Pepe[]>([]);

  const discountedMintPrice = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_SALES_ABI,
    functionName: 'discountedMintPrice',
    query: {
      refetchInterval: 5000,
    },
  });

  const mintPrice = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_SALES_ABI,
    functionName: 'mintPrice',
    query: {
      refetchInterval: 5000,
    },
  });

  useEffect(() => {
    setBurnQuantity(1);

    if (selectedEdition.startsWith('pepe')) {
      const id = Number(selectedEdition.split('-')[1]);
      setQuantity(pepes.find((pepe) => pepe.id === id)!.credits);
    } else {
      setQuantity(1);
    }
  }, [selectedEdition]);

  // useEffect(() => {
  //   if (mint.isSuccess) {
  //     async function loadTokens() {
  //       const publicClient = createPublicClient({
  //         chain: getChain(),
  //         transport: http(),
  //       });

  //       const balanceOf = await publicClient.readContract({
  //         address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS as `0x${string}`,
  //         abi: PEPE_NFT_ABI,
  //         functionName: 'balanceOf',
  //         args: [address],
  //       });

  //       const requests: number[] = [];
  //       for (let i = 0; i < Number(balanceOf as bigint); i++) {
  //         requests.push(i);
  //       }

  //       const tokens = await Promise.all(
  //         requests.map(async (i) => {
  //           return publicClient.readContract({
  //             address:
  //               process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS!.toLowerCase() as `0x${string}`,
  //             functionName: 'tokenOfOwnerByIndex',
  //             args: [address, BigInt(i)],
  //             abi: PEPE_NFT_ABI,
  //           });
  //         }),
  //       );

  //       const sortedTokens = tokens
  //         .map((t) => Number(t))
  //         .sort((a, b) => a - b)
  //         .slice(-1 * quantity);

  //       const pepes = await Promise.all(
  //         sortedTokens.map(async (token) => {
  //           return await axios({
  //             method: 'POST',
  //             url: '/api/getToken',
  //             data: {
  //               address,
  //               tokenId: token,
  //             },
  //           });
  //         }),
  //       );

  //       setTokens(
  //         pepes.map((pepe, index) => ({
  //           ...pepe.data,
  //           id: sortedTokens[index],
  //         })),
  //       );
  //     }

  //     loadTokens();
  //   }
  // }, [mint.isSuccess]);

  const burnForCreditsError = (() => {
    if (!burnForCredits.error) {
      return '';
    }

    if (burnForCredits.error.message.includes('burn amount exceeds totalSupply')) {
      return 'Not enough supply.';
    } else if (burnForCredits.error.message.includes('burn amount exceeds balance')) {
      return 'Not enough quantity.';
    } else if (burnForCredits.error.message.includes('User denied transaction signature')) {
      return 'User denied transaction signature.';
    } else if (burnForCredits.error.message.includes('caller is not token owner or approve')) {
      return 'User has not approved burn.';
    }

    console.error(burnForCredits.error.message);

    return 'Something weird happened. Try again.';
  })();

  const mintError = (() => {
    if (!mint.error) {
      return '';
    }

    if (mint.error.message.includes('burn amount exceeds totalSupply')) {
      return 'Not enough supply.';
    } else if (mint.error.message.includes('burn amount exceeds balance')) {
      return 'Not enough quantity.';
    } else if (mint.error.message.includes('User denied transaction signature')) {
      return 'User denied transaction signature.';
    } else if (mint.error.message.includes('NotEnoughCredits')) {
      return 'Not enough credits.';
    } else if (
      mint.error.message.includes(
        'of executing this transaction exceeds the balance of the account',
      )
    ) {
      return 'Not enough ETH.';
    } else if (mint.error.message.includes('Pausable: paused')) {
      return 'Sale is paused.';
    } else if (mint.error.message.includes('Forbidden')) {
      return 'Full Set not detected.';
    } else if (mint.error.message.includes('0xd5c03226')) {
      return 'Exceeds mint limit. Reach out to support to do this manually.';
    }

    console.error(mint.error.message);

    return 'Something weird happened. Try again.';
  })();

  const setApprovalForAllError = (() => {
    if (!setApprovalForAll.error) {
      return '';
    }

    if (setApprovalForAll.error.message.includes('User denied transaction signature')) {
      return 'User denied transaction signature.';
    }

    console.error(setApprovalForAll.error.message);

    return 'Something weird happened. Try again.';
  })();

  const isZogzFullSetOwner = !!proof.data?.proof;

  const items = [
    {
      label: 'Regular Mint Price',
      note: 'Unlimited Available',
      value: 'regular',
    },
  ];

  if (isZogzFullSetOwner) {
    items.unshift({
      label: 'ZOGZ Full Set Owner Price',
      note: 'Unlimited Available',
      value: 'zogz',
    });
  }

  if (hedzBalanceOf.data) {
    items.unshift({
      label: 'HEDZ NFT Price',
      note: `${hedzBalanceOf.data} Available`,
      value: 'hedz',
    });
  }

  if (mint.isSuccess) {
    return (
      <Modal>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1em',
            gap: 20,
            justifyContent: 'center',
            maxWidth: 800,
          }}
        >
          <h1>
            Minted {quantity} Pepe{quantity === 1 ? '' : 's'}
          </h1>
          {/* <ul
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
              justifyContent: 'center',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {!tokens.length &&
              new Array(quantity).fill(
                <li style={{ margin: 0, padding: 0 }}>
                  <div
                    style={{
                      alignItems: 'center',
                      gap: 10,
                      display: 'flex',
                      position: 'relative',
                    }}
                  >
                    <img
                      height="80.26"
                      width="100"
                      src={`/images/blank.png`}
                      style={{ backgroundColor: '#CCC', display: 'block' }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0,
                        position: 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CircularProgress />
                    </div>
                  </div>
                </li>,
              )}
            {tokens.map((token) => (
              <li key={token.id} style={{ margin: 0, padding: 0 }}>
                <div
                  style={{
                    alignItems: 'center',
                    gap: 10,
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  <img
                    height="80.26"
                    width="100"
                    src={`/images/blank.png`}
                    style={{ backgroundColor: '#CCC', display: 'block' }}
                  />
                  {token.traits.map((trait) => (
                    <img
                      key={`${token.id}-${trait.id}`}
                      width="100"
                      src={trait.imageUrl || `/images/traits/${trait.folder}/${trait.file}`}
                      style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul> */}
          <Button onClick={onClose}>Cool</Button>
        </div>
      </Modal>
    );
  }

  if (
    mintLimit.isPending ||
    mintPrice.isPending ||
    hedzBalanceOf.isPending ||
    pepeBalanceOfBatch.isPending ||
    pepeIsApprovedForAll.isPending ||
    zogzBalanceOfBatch.isPending ||
    zogzIsApprovedForAll.isPending
  ) {
    return (
      <Modal>
        <CircularProgress />
      </Modal>
    );
  }

  const ownedPepes = pepes
    .map((pepe, index) => ({
      ...pepe,
      owned: (pepeBalanceOfBatch.data as bigint[])[index],
    }))
    .filter((pepe) => pepe.owned > BigInt(0));

  const ownedZogz = zogz
    .map((zog, index) => ({
      ...zog,
      owned: (zogzBalanceOfBatch.data as bigint[])[index],
    }))
    .filter((zog) => zog.owned > BigInt(0));

  if (dialogType === '') {
    return (
      <Modal onClose={onClose}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1em',
            gap: 20,
            maxWidth: 500,
            width: '100%',
          }}
        >
          <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
            Minting has ended!
          </h1>
          <p>THANK YOU for having fun with us!</p>
          <p>
            Be sure to check out{` `}
            <Link
              href="https://opensea.io/collection/peplicator-by-matt-furie"
              style={{ color: 'brown' }}
            >
              OpenSea
            </Link>
            !
          </p>
          <Button
            color="primary"
            onClick={() => {
              onClose?.();
            }}
            style={{
              display: 'block',
              textAlign: 'center',
              width: '100%',
            }}
          >
            Okay!
          </Button>
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                textAlign: 'center',
                width: isSmall ? '100%' : 'calc(50% - 10px)',
              }}
            >
              <div style={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                Regular Mint
              </div>
              <Button
                color="primary"
                onClick={() => {
                  setQuantity(1);
                  setDialogType('mint');
                }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {formatEther(mintPrice.data as bigint)} ETH
              </Button>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                textAlign: 'center',
                width: isSmall ? '100%' : 'calc(50% - 10px)',
              }}
            >
              <div style={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                Burn OE&apos;s &amp; Mint
              </div>
              <Button
                color="primary"
                disabled={mint.isPending || (!ownedPepes.length && !ownedZogz.length)}
                onClick={() => {
                  setQuantity(1);
                  setDialogType('burn');
                }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {mint.isPending && <>Waiting...</>}
                {!mint.isPending && <>{formatEther((mintPrice.data as bigint) / BigInt(2))} ETH</>}
              </Button>
              {ownedPepes.length > 0 || ownedZogz.length > 0 ? (
                <div style={{ color: 'green', fontSize: '.75em' }}>50% discount for each burn</div>
              ) : (
                <div style={{ color: 'red', fontSize: '.75em' }}>
                  You don&apos;t own any OE&apos;s
                </div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                textAlign: 'center',
                width: isSmall ? '100%' : 'calc(50% - 10px)',
              }}
            >
              <div style={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                ZOGZ Full Set Owners
              </div>
              <Button
                color="primary"
                disabled={mint.isPending || !isZogzFullSetOwner}
                onClick={() => {
                  setQuantity(1);
                  setDialogType('owner');
                }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {mint.isPending && <>Waiting...</>}
                {!mint.isPending && <>{formatEther((mintPrice.data as bigint) / BigInt(2))} ETH</>}
              </Button>
              {isZogzFullSetOwner ? (
                <div style={{ color: 'green', fontSize: '.75em' }}>50% discount unlimited</div>
              ) : (
                <div style={{ color: 'red', fontSize: '.75em' }}>
                  You don&apos;t own a ZOGZ Full Set
                </div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                textAlign: 'center',
                width: isSmall ? '100%' : 'calc(50% - 10px)',
              }}
            >
              <div style={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                HEDZ Owners
              </div>
              <Button
                color="primary"
                disabled={mint.isPending || !hedzBalanceOf.data}
                onClick={() => {
                  setQuantity(1);
                  setDialogType('hedzOwner');
                }}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {mint.isPending && <>Waiting...</>}
                {!mint.isPending && <>{formatEther(discountedMintPrice.data as bigint)} ETH</>}
              </Button>
              {hedzBalanceOf.data ? (
                <div style={{ color: 'green', fontSize: '.75em' }}>
                  50% discount for each verified NFT
                </div>
              ) : (
                <div style={{ color: 'red', fontSize: '.75em' }}>
                  You don&apos;t own any HEDZ NFTs
                </div>
              )}
            </div>
          </div> */}
        </div>
      </Modal>
    );
  }

  if (dialogType === 'owner') {
    return (
      <Modal>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1em',
            gap: 20,
            minWidth: 300,
          }}
        >
          <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
            Special Mint for
            <br />
            ZOGZ Full Set Owners
          </h1>
          <div>How many Peplicator NFTs do you want to mint?</div>
          <QuantitySelector
            onChange={(value) => {
              mint.reset();
              setQuantity(value);
            }}
            max={Number(mintLimit.data)}
            value={quantity}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}>
            <Button
              color="secondary"
              onClick={() => setDialogType('')}
              style={{
                width: '50%',
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={mint.isPending}
              onClick={() => {
                mint.writeContract({
                  address: process.env
                    .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                  abi: PEPE_SALES_ABI,
                  functionName: 'mintWithOwnerDiscount',
                  args: [
                    BigInt(quantity),
                    (
                      proof.data as {
                        proof: string;
                        root: string;
                      }
                    ).proof,
                  ],
                  value: ((mintPrice.data as bigint) * BigInt(quantity)) / BigInt(2),
                });
              }}
              style={{
                width: '50%',
              }}
            >
              {mint.isPending && <>Waiting...</>}
              {!mint.isPending && (
                <>{formatEther(((mintPrice.data as bigint) * BigInt(quantity)) / BigInt(2))} ETH</>
              )}
            </Button>
          </div>
          {mintError && <div style={{ color: 'red', textAlign: 'center' }}>{mintError}</div>}
        </div>
      </Modal>
    );
  }

  if (dialogType === 'hedzOwner') {
    return (
      <Modal>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1em',
            gap: 20,
            minWidth: 300,
          }}
        >
          <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
            Special Mint for
            <br />
            HEDZ Owners
          </h1>
          {(hedzBalanceOf.data as bigint) === BigInt(0) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                textAlign: 'center',
              }}
            >
              <div>You don&apos;t own any HEDZ!</div>
              <Button
                color="secondary"
                onClick={() => setDialogType('')}
                style={{
                  width: '50%',
                }}
              >
                Go Back
              </Button>
            </div>
          )}
          {(hedzBalanceOf.data as bigint) > BigInt(0) && (
            <>
              <div>How many Peplicator NFTs do you want to mint?</div>
              <QuantitySelector
                onChange={(value) => {
                  mint.reset();
                  setQuantity(value);
                }}
                max={Number(mintLimit.data)}
                value={quantity}
              />
              <div style={{ textAlign: 'center' }}>
                You own {Number(hedzBalanceOf.data as bigint)} HEDZ NFTs which means
                <br />
                you get {Number(hedzBalanceOf.data as bigint)} Peplicator NFTs at this special
                price.
              </div>
              <div style={{ textAlign: 'center' }}>
                You have {Number((hedzBalanceOf.data as bigint) - (hedzClaims.data as bigint))}/
                {Number(hedzBalanceOf.data as bigint)} remaining.
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}
              >
                <Button
                  color="secondary"
                  onClick={() => setDialogType('')}
                  style={{
                    width: '50%',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={mint.isPending}
                  onClick={() => {
                    mint.writeContract({
                      address: process.env
                        .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                      abi: PEPE_SALES_ABI,
                      functionName: 'mintWithClaimsDiscount',
                      args: [BigInt(quantity)],
                      value: (discountedMintPrice.data as bigint) * BigInt(quantity),
                    });
                  }}
                  style={{
                    width: '50%',
                  }}
                >
                  {mint.isPending && <>Waiting...</>}
                  {!mint.isPending && (
                    <>{formatEther((discountedMintPrice.data as bigint) * BigInt(quantity))} ETH</>
                  )}
                </Button>
              </div>
              {mintError && <div style={{ color: 'red', textAlign: 'center' }}>{mintError}</div>}
            </>
          )}
        </div>
      </Modal>
    );
  }

  if (dialogType === 'mint') {
    return (
      <Modal>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '1em',
            gap: 20,
            minWidth: 300,
          }}
        >
          <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
            Regular Mint
          </h1>
          <div>How many Peplicator NFTs do you want to mint?</div>
          <QuantitySelector
            onChange={(value) => {
              mint.reset();
              setQuantity(value);
            }}
            max={Number(mintLimit.data)}
            value={quantity}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}>
            <Button
              color="secondary"
              onClick={() => setDialogType('')}
              style={{
                width: '50%',
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={mint.isPending}
              onClick={() => {
                mint.writeContract({
                  address: process.env
                    .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                  abi: PEPE_SALES_ABI,
                  functionName: 'mint',
                  args: [BigInt(quantity)],
                  value: (mintPrice.data as bigint) * BigInt(quantity),
                });
              }}
              style={{
                width: '50%',
              }}
            >
              {mint.isPending && <>Waiting...</>}
              {!mint.isPending && (
                <>{formatEther((mintPrice.data as bigint) * BigInt(quantity))} ETH</>
              )}
            </Button>
          </div>
          {mintError && <div style={{ color: 'red', textAlign: 'center' }}>{mintError}</div>}
        </div>
      </Modal>
    );
  }

  return (
    <Modal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1em',
          gap: 20,
          minWidth: 300,
        }}
      >
        <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
          Burn OE&apos;s &amp; Mint
        </h1>
        {!ownedPepes.length && !ownedZogz.length && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              textAlign: 'center',
            }}
          >
            <div>You don&apos;t own any Pepe OE&apos;s or ZOGZ OE&apos;s!</div>
            <Button
              color="secondary"
              onClick={() => setDialogType('')}
              style={{
                width: '50%',
              }}
            >
              Go Back
            </Button>
          </div>
        )}
        {(ownedPepes.length > 0 || ownedZogz.length > 0) && (
          <>
            <div>What do you wanna burn?</div>
            <GroupDropDown
              groups={[
                {
                  label: 'Pepe Open Editions',
                  name: 'pepe',
                  items: ownedPepes.map((edition) => ({
                    image: edition.image,
                    label: `${edition.name} (Qty: ${edition.owned})`,
                    note: `50% discount for ${edition.credits} mint${
                      edition.credits === 1 ? '' : 's'
                    }`,
                    value: `pepe-${edition.id}`,
                  })),
                },
                {
                  label: 'ZOGZ Open Editions',
                  name: 'zogz',
                  items: ownedZogz.map((edition) => ({
                    image: edition.image,
                    label: `${edition.name} (Qty: ${edition.owned})`,
                    note: `50% discount for ${edition.credits} mint${
                      edition.credits === 1 ? '' : 's'
                    }`,
                    value: `zogz-${edition.id}`,
                  })),
                },
              ]}
              onChange={(value) => setSelectedEdition(value)}
              value={selectedEdition}
            />
            {((selectedEdition.startsWith('pepe') && !pepeIsApprovedForAll.data) ||
              (selectedEdition.startsWith('zogz') && !zogzIsApprovedForAll.data)) && (
              <div
                style={{
                  alignItems: 'center',
                  color: 'blue',
                  display: 'flex',
                  gap: 10,
                  fontSize: '.75em',
                }}
              >
                You must allow Peplicator to burn these editions.
                <Button
                  disabled={!setApprovalForAll.isIdle}
                  onClick={() => {
                    if (selectedEdition.startsWith('pepe')) {
                      setApprovalForAll.writeContract({
                        address: process.env
                          .NEXT_PUBLIC_PEPE_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
                        abi: PEPE_EDITIONS_ABI,
                        functionName: 'setApprovalForAll',
                        args: [process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS, true],
                      });
                    } else {
                      setApprovalForAll.writeContract({
                        address: process.env
                          .NEXT_PUBLIC_ZOGZ_EDITIONS_CONTRACT_ADDRESS as `0x${string}`,
                        abi: ZOGZ_EDITIONS_ABI,
                        functionName: 'setApprovalForAll',
                        args: [process.env.NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS, true],
                      });
                    }
                  }}
                >
                  {!setApprovalForAll.isIdle ? 'Waiting...' : 'Approve Burn'}
                </Button>
              </div>
            )}
            {selectedEdition && (
              <>
                <div>How many OE&apos;s do you want to burn?</div>
                <QuantitySelector
                  onChange={(value) => {
                    mint.reset();
                    setBurnQuantity(value);
                    if (selectedEdition.startsWith('pepe')) {
                      const id = Number(selectedEdition.split('-')[1]);
                      setQuantity(pepes.find((pepe) => pepe.id === id)!.credits * value);
                    } else {
                      setQuantity(value);
                    }
                  }}
                  max={Number(mintLimit.data)}
                  value={burnQuantity}
                />
                <div>How many Peplicator NFTs do you want to mint?</div>
                <QuantitySelector
                  onChange={(value) => {
                    mint.reset();
                    setQuantity(value);
                    if (selectedEdition.startsWith('pepe')) {
                      const id = Number(selectedEdition.split('-')[1]);
                      setBurnQuantity(value / pepes.find((pepe) => pepe.id === id)!.credits);
                    } else {
                      setBurnQuantity(value);
                    }
                  }}
                  countBy={(() => {
                    if (selectedEdition.startsWith('pepe')) {
                      const id = Number(selectedEdition.split('-')[1]);
                      return pepes.find((pepe) => pepe.id === id)!.credits;
                    } else {
                      return 1;
                    }
                  })()}
                  max={Number(mintLimit.data)}
                  value={quantity}
                />
              </>
            )}
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}
            >
              <Button
                color="secondary"
                onClick={() => setDialogType('')}
                style={{
                  width: '50%',
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={
                  mint.isPending ||
                  !selectedEdition ||
                  (selectedEdition.startsWith('pepe') && !pepeIsApprovedForAll.data) ||
                  (selectedEdition.startsWith('zogz') && !zogzIsApprovedForAll.data)
                }
                onClick={() => {
                  if (selectedEdition.startsWith('pepe')) {
                    mint.writeContract({
                      address: process.env
                        .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                      abi: PEPE_SALES_ABI,
                      functionName: 'mintWithPepeEditionsBurn',
                      args: [
                        BigInt(quantity),
                        BigInt(selectedEdition.split('-')[1]),
                        BigInt(burnQuantity),
                      ],
                      value: ((mintPrice.data as bigint) * BigInt(quantity)) / BigInt(2),
                    });
                  } else if (selectedEdition.startsWith('zogz')) {
                    mint.writeContract({
                      address: process.env
                        .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                      abi: PEPE_SALES_ABI,
                      functionName: 'mintWithZogzEditionsBurn',
                      args: [BigInt(quantity), BigInt(selectedEdition.split('-')[1])],
                      value: ((mintPrice.data as bigint) * BigInt(quantity)) / BigInt(2),
                    });
                  }
                }}
                style={{
                  width: '50%',
                }}
              >
                {mint.isPending && <>Waiting...</>}
                {!mint.isPending && (
                  <>
                    {formatEther(((mintPrice.data as bigint) * BigInt(quantity)) / BigInt(2))} ETH
                  </>
                )}
              </Button>
            </div>
            {mintError && <div style={{ color: 'red', textAlign: 'center' }}>{mintError}</div>}
          </>
        )}
      </div>
    </Modal>
  );
}
