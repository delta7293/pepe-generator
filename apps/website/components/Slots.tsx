import 'react-loading-skeleton/dist/skeleton.css';

import { Box, CircularProgress, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import React, { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { createPublicClient } from 'viem';

import { ORDERED_TRAITS } from '@/constants/ORDERED_TRAITS';
import { Pepe, usePepeStore } from '@/stores/pepe';
import styles from '@/styles/Slots.module.css';
import { shuffleArray } from '@/utils/shuffleArray';
import {
  http,
  useAccount,
  useClient,
  useReadContract,
  useSignMessage,
  useWriteContract,
} from 'wagmi';
import PEPE_SALES_ABI from '@/constants/PEPE_SALES_ABI';
import PEPE_NFT_ABI from '@/constants/PEPE_NFT_ABI';
import getPepe from '@/utils/getPepe';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import getChain from '@/utils/getChain';
import Modal from './Modal';
import Button from './Button';
import Clickable from './Clickable';
import { isMobile } from 'react-device-detect';

interface Trait {
  id: number;
  file: string;
  name: string;
  imageUrl?: string;
}

const labelSlotTraits = [
  'stuff',
  'hood',
  'eyes',
  'hats',
  'hair',
  'facial',
  'poop',
  'mouth',
  'face',
  'etc',
  'frog',
  'bg',
];

interface Props {
  initialTokenId?: number;
}

export default function Slots({ initialTokenId }: Props) {
  const { address, connector } = useAccount();
  const signer = useSignMessage();

  const [accessToken, setAccessToken] = useState('');
  const [message, setMessage] = useState('');
  const [modalType, setModalType] = useState<'' | 'sign' | 'warning' | 'welcome'>('');
  const [startSpinning, setStartSpinning] = useState(false);

  const isSmall = useMediaQuery('(max-width:600px)');

  const balanceOf = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 5000,
    },
  });

  const prepare = useMutation({
    mutationFn: async () => {
      const res = await axios({
        method: 'POST',
        url: '/api/prepare',
        data: {
          address,
        },
      });

      setMessage(res.data.message);

      signer.signMessage({ message: res.data.message });

      return {};
    },
  });

  const sign = useMutation({
    mutationFn: async () => {
      const res = await axios({
        method: 'POST',
        url: '/api/sign',
        data: {
          address,
          message,
          signature: signer.data,
        },
      });

      setAccessToken(res.data.token);

      return {};
    },
  });

  const spin = useMutation({
    mutationFn: async () => {
      setStartSpinning(true);

      const res = await axios({
        method: 'POST',
        url: '/api/spin',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          address,
          tokenId,
        },
      });

      setPepeId(res.data.id);
      setSpunPepe(res.data);

      return {};
    },
  });

  useEffect(() => {
    if (!address || !message || !signer.data) {
      return;
    }

    sign.mutate();
  }, [address, message, signer.data]);

  const mint = useWriteContract();

  const fetchTraits = usePepeStore((state) => state.fetchTraits);
  const traits = usePepeStore((state) => state.traits);

  const [newPepe, setNewPepe] = useState<Pepe>();
  const [pepe, setPepe] = useState<Pepe>();

  const videoRef = useRef<HTMLVideoElement>(null);

  const [slotTraits, setSlotTraits] = useState<Trait[][]>([]);
  const [slots, setSlots] = useState<Trait[][]>([]);
  const [spins, setSpins] = useState<boolean[]>([]);

  const [labelSlots, setLabelSlots] = useState<string[][]>([]);
  const [labelSpins, setLabelSpins] = useState<boolean[]>([]);

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [page, setPage] = useState(1);
  const [pepeId, setPepeId] = useState(0);
  const [spunPepe, setSpunPepe] = useState<Pepe>();
  const [tokenId, setTokenId] = useState(initialTokenId || 0);
  const [tokens, setTokens] = useState<Pepe[]>([]);

  const handleSpin = async (pepe?: Pepe) => {
    if (isSpinning) {
      return;
    }

    setIsSpinning(true);

    // setSlots(ORDERED_TRAITS.map((_, index) => shuffleArray(slotTraits[index]).slice(0, 18)));

    const randomPepe = pepe || (await getPepe());

    setLabelSlots(
      labelSlots.map((s, index) =>
        s.concat(randomPepe.traits.find((t) => t.folder === labelSlotTraits[index])?.value || ''),
      ),
    );
    setNewPepe(randomPepe);

    videoRef.current?.play();

    spins.forEach((_, index) => {
      setTimeout(() => {
        setSpins(spins.map((_, i) => i <= index));
      }, 250 * index);
    });

    labelSpins.forEach((_, index) => {
      setTimeout(() => {
        setLabelSpins(labelSpins.map((_, i) => i <= index));
      }, 250 * index);
    });

    setTimeout(
      () => {
        setPepe(randomPepe);
        setSlots(ORDERED_TRAITS.map((_, index) => shuffleArray(slotTraits[index]).slice(0, 18)));
        setLabelSlots(
          labelSlotTraits.map((trait) =>
            [randomPepe.traits.find((t) => t.folder === trait)?.value || ''].concat(
              shuffleArray(
                traits
                  .find((t) => t.folder === trait)!
                  .options.concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options)
                  .concat(traits.find((t) => t.folder === trait)!.options),
              )
                .slice(0, 18)
                .map((t) => t.name),
            ),
          ),
        );
        setSpins(spins.map(() => false));
        setLabelSpins(new Array(12).fill(false));
        setStartSpinning(false);
        setIsSpinning(false);
      },
      5000 + 100 * ORDERED_TRAITS.length,
    );
  };

  const init = useCallback(async () => {
    if (pepe || !traits.length) {
      return;
    }

    const randomPepe = await getPepe();

    const newSlotTraits = ORDERED_TRAITS.map((traitName) => {
      const trait = traits.find((t) => t.folder === traitName)!;
      const blanks =
        traitName === 'bg' || traitName === 'eyes'
          ? []
          : traitName === 'frog'
            ? Array.from({ length: 50 - traitName.length }, () => ({
                id: 0,
                file: 'body_0000s_0000_sad-frog.png',
                name: 'body_0000s_0000_sad-frog.png',
              })).concat(
                Array.from({ length: 50 - traitName.length }, () => ({
                  id: 0,
                  file: 'body_0000s_0001_happy-frog.png',
                  name: 'body_0000s_0001_happy-frog.png',
                })),
              )
            : Array.from({ length: 177 - traitName.length }, () => ({
                id: 0,
                file: '',
                name: '',
              }));
      if (traitName === 'bg') {
        return trait.options.concat(trait.options).concat(trait.options).concat(trait.options);
      }
      return trait.options.concat(blanks);
    });

    setPepe(randomPepe);
    setSlotTraits(newSlotTraits);
    setSlots(ORDERED_TRAITS.map((_, index) => shuffleArray(newSlotTraits[index]).slice(0, 18)));
    setSpins(new Array(ORDERED_TRAITS.length).fill(false));

    setLabelSlots(
      [
        'stuff',
        'hood',
        'eyes',
        'hats',
        'hair',
        'facial',
        'poop',
        'mouth',
        'face',
        'etc',
        'frog',
        'bg',
      ].map((trait, index) =>
        [randomPepe.traits.find((t) => t.folder === trait)?.value || ''].concat(
          shuffleArray(
            traits
              .find((t) => t.folder === trait)!
              .options.concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options)
              .concat(traits.find((t) => t.folder === trait)!.options),
          )
            .slice(0, 18)
            .map((t) => t.name),
        ),
      ),
    );
    setLabelSpins([false, false, false, false]);
  }, [pepe, traits]);

  useEffect(() => {
    setIsDemoMode(!address || !balanceOf.data);
  }, [address, balanceOf.data]);

  useEffect(() => {
    fetchTraits();
  }, [fetchTraits]);

  useEffect(() => {
    init();
  }, [init]);

  // useEffect(() => {
  //   if (!localStorage.getItem('dismissWelcome')) {
  //     setModalType('welcome');
  //   }
  // }, []);

  useEffect(() => {
    if ((balanceOf.data as bigint) > BigInt(0)) {
      async function loadContract() {
        const publicClient = createPublicClient({
          chain: getChain(),
          transport: http(),
        });

        const startIndex = (page - 1) * 10;
        const endIndex =
          Number(balanceOf.data as bigint) < startIndex + 10
            ? Number(balanceOf.data as bigint)
            : startIndex + 10;

        const requests: number[] = [];
        for (let i = startIndex; i < endIndex; i++) {
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

        const res = await axios({
          method: 'POST',
          url: '/api/getToken',
          data: {
            address,
            tokenId: initialTokenId || tokens[0],
          },
        });

        setSpunPepe(res.data);
        setTokenId(initialTokenId || tokens[0]);

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
  }, [balanceOf.data, initialTokenId, page, pepeId]);

  useEffect(() => {
    if (mint.isSuccess) {
      balanceOf.refetch();
    }
  }, [mint.isSuccess]);

  useEffect(() => {
    if (isDemoMode && slotTraits.length) {
      handleSpin();
    }
  }, [isDemoMode, isSpinning, slotTraits]);

  useEffect(() => {
    if (spunPepe && slotTraits.length) {
      handleSpin(spunPepe);
    }
  }, [spunPepe, slotTraits]);

  useEffect(() => {
    if (sign.isSuccess) {
      setModalType('warning');
    }
  }, [sign.isSuccess]);

  // console.log(mintPrice.error);
  // console.log(roll.data);
  // console.log(roll.error);
  // console.log(mint.error);
  // console.log(mint.data);

  const mintError = (() => {
    if (!mint.error) {
      return '';
    }

    if (mint.error.message.includes('burn amount exceeds totalSupply')) {
      return 'Not enough supply.';
    } else if (mint.error.message.includes('User denied transaction signature')) {
      return '';
    }

    console.error(mint.error.message);

    return 'Something weird happened. Try again.';
  })();

  const rand = Math.random();

  return (
    <>
      <Link
        href="/"
        style={{
          display: 'flex',
          position: isMobile ? 'static' : 'fixed',
          left: 0,
          justifyContent: 'center',
          right: 0,
          top: 40,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          loop
          src="/videos/title.mp4"
          style={{
            cursor: address ? 'pointer' : 'not-allowed',
            height: isMobile ? 80 : 100,
            filter: isDemoMode ? 'grayscale(1)' : undefined,
          }}
        />
      </Link>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={2}
        height={isMobile ? 300 : 'auto'}
        position={isMobile ? 'static' : 'fixed'}
        top={0}
        right={0}
        bottom={0}
        left={0}
        sx={{
          filter: isDemoMode ? 'grayscale(1)' : undefined,
          transition: 'transform .25s',
          transform: {
            xs: 'scale(.5)',
            sm: 'scale(.6)',
            md: 'scale(.7)',
            lg: 'scale(.8)',
            xl: 'scale(1)',
          },
        }}
      >
        {ORDERED_TRAITS.map((traitName, index) => (
          <Box key={index} overflow="hidden" height={400} position="absolute" width={400}>
            <ul
              className={classNames(styles.boxList, {
                [styles.spin]: spins[index],
              })}
            >
              <li>
                <div />
              </li>
              {slots[index]?.map((item, slotIndex) => (
                <li key={`${traitName}-${slotIndex}`}>
                  {item.file ? (
                    <img
                      src={
                        item.imageUrl ? item.imageUrl : `/images/traits/${traitName}/${item.file}`
                      }
                    />
                  ) : (
                    <div />
                  )}
                </li>
              ))}
            </ul>
          </Box>
        ))}
        {pepe?.traits.map((trait, index) => (
          <Box key={trait.index} overflow="hidden" height={400} position="absolute" width={400}>
            <img
              className={classNames({
                [styles.spin]: spins[index],
              })}
              src={trait.imageUrl ? trait.imageUrl : `/images/traits/${trait.folder}/${trait.file}`}
            />
          </Box>
        ))}
        {!isSpinning && !!tokenId && (
          <Box overflow="hidden" height={400} position="absolute" width={400}>
            <img src={`https://pepe-data-2.vercel.app/images/${tokenId}?rand=${rand}`} />
          </Box>
        )}
        {newPepe?.traits.map((trait, index) => (
          <Box key={trait.index} overflow="hidden" height={400} position="absolute" width={400}>
            <img
              className={classNames(styles.spin2, {
                [styles.spin3]: spins[index],
              })}
              src={trait.imageUrl ? trait.imageUrl : `/images/traits/${trait.folder}/${trait.file}`}
            />
          </Box>
        ))}
        <img height="600px" src="/images/frame.png" />
      </Stack>

      <div
        style={{
          alignItems: 'center',
          bottom: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          left: 0,
          position: isMobile ? 'static' : 'fixed',
          right: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={(e: MouseEvent) => {
            if (accessToken) {
              if (e.metaKey) {
                spin.mutate();
              } else {
                setModalType('warning');
              }
            } else {
              setModalType('sign');
            }
            // spin.mutate();
          }}
          disabled={!address || isSpinning || !tokens.length || startSpinning}
          style={{
            background: 'none',
            border: 0,
            cursor:
              !address || isSpinning || !tokens.length || startSpinning ? 'not-allowed' : 'pointer',
            margin: 0,
            padding: 0,
          }}
        >
          <video
            playsInline
            ref={videoRef}
            src="/videos/push-button.mp4"
            style={{
              cursor:
                !address || isSpinning || !tokens.length || startSpinning
                  ? 'not-allowed'
                  : 'pointer',
              height: 100,
              // filter:
              //   address && !!availableSpins.data?.remaining && !isDemoMode && !isSpinning
              //     ? undefined
              //     : 'grayscale(1)',
              marginBottom: isMobile ? 0 : -20,
            }}
          />
          <div>Don&apos;t like this Pepe? Respin for a different one!</div>
        </button>
        <div>
          <Link
            href={`https://opensea.io/assets/ethereum/0x0baeccd651cf4692a8790bcc4f606e79bf7a3b1c/${tokenId}`}
            target="_blank"
            style={{ color: 'brown', fontSize: '.75em' }}
          >
            View on OpenSea
          </Link>
        </div>
        {mintError}
      </div>
      <Stack
        alignItems="center"
        gap={2}
        margin={isMobile ? '0 auto' : undefined}
        padding={isMobile ? '10px 10px 10px 0' : 0}
        position={isMobile ? 'static' : 'fixed'}
        right={20}
        top={180}
        zIndex="10"
        maxWidth={400}
        width="100%"
      >
        <Grid
          container
          margin="0 auto"
          maxWidth="600px"
          spacing={1}
          textAlign="center"
          width="100%"
          justifyContent="center"
        >
          {[
            'stuff',
            'hood',
            'eyes',
            'hats',
            'hair',
            'facial',
            'poop',
            'mouth',
            'face',
            'etc',
            'frog',
            'bg',
          ].map((trait, index) => (
            <Grid key={trait} item xs={6} md={6}>
              <div
                style={{
                  borderRadius: '10px',
                  padding: '.2rem 0 0 0',
                  border: '1px solid #a55d07',
                  overflow: 'hidden',
                  backgroundImage:
                    !isSpinning && pepe?.traits.find((t) => t.folder === trait)
                      ? 'linear-gradient(160deg, #a54e07, #b47e11, #fef1a2, #bc881b, #a54e07)'
                      : 'none',
                  opacity: isSpinning || pepe?.traits.find((t) => t.folder === trait) ? 1 : 0.25,
                }}
              >
                <Typography
                  color="black"
                  fontWeight="bold"
                  textTransform="uppercase"
                  sx={{
                    borderBottom: '1px #a55d07 solid',
                    fontSize: {
                      xs: 8,
                      sm: 10,
                      md: 12,
                      lg: 14,
                    },
                  }}
                >
                  {trait}
                </Typography>
                <Stack height="30px" overflow="hidden" width="100%" paddingBottom=".2rem">
                  <div
                    className={classNames({
                      [styles.spinLabel]: labelSpins[index],
                    })}
                  >
                    {labelSlots[index]?.map((l, labelIndex) => (
                      <Typography
                        key={labelIndex}
                        component="div"
                        variant="h6"
                        sx={{
                          fontSize: {
                            xs: 14,
                            sm: 16,
                            md: 18,
                          },
                          backgroundColor: 'white',
                          lineHeight: '30px',
                          height: '30px',
                        }}
                      >
                        {l}
                      </Typography>
                    ))}
                  </div>
                </Stack>
              </div>
            </Grid>
          ))}
        </Grid>
      </Stack>
      {isDemoMode && (
        <motion.div
          style={{
            alignItems: 'center',
            bottom: 0,
            color: 'pink',
            display: 'flex',
            fontSize: '2em',
            justifyContent: 'center',
            left: 0,
            position: isMobile ? 'static' : 'fixed',
            right: 0,
            textTransform: 'lowercase',
            top: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
        >
          Demo Mode
        </motion.div>
      )}
      {!isSmall && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            position: isMobile ? 'static' : 'fixed',
            bottom: 20,
            left: 20,
            top: 20,
            width: 300,
            zIndex: 20,
          }}
        >
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ background: 'white', position: 'sticky', top: 0, zIndex: 1 }}>
              {!isInitialized && <Skeleton height={48.5} width={180.02} />}
              {isInitialized && <>My Pepes ({Number(balanceOf.data)})</>}
            </h2>
            <Link href="/gallery" style={{ fontSize: '.75em', textTransform: 'uppercase' }}>
              {!isInitialized && <Skeleton height={24.5} width={72.99} />}
              {isInitialized && <>View All &raquo;</>}
            </Link>
          </div>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              height: 'calc(100% - 100px)',
              listStyle: 'none',
              margin: 0,
              overflow: 'scroll',
              padding: 0,
            }}
          >
            {tokens.length === 0 && (
              <>
                {new Array(10).fill(null).map((_, index) => (
                  <Skeleton key={`skeleton-${index}`} height="80.26px" />
                ))}
              </>
            )}
            {tokens.map((token, index) => (
              <li key={`${token.id}-${index}`} style={{ margin: 0, padding: 0 }}>
                <Link
                  href={`/pepes/${token.id}`}
                  style={{
                    alignItems: 'center',
                    border: token.id === tokenId ? '1px solid #a55d07' : '1px transparent solid',
                    backgroundImage:
                      token.id === tokenId
                        ? 'linear-gradient(160deg, #a54e07, #b47e11, #fef1a2, #bc881b, #a54e07)'
                        : 'none',
                    color: token.id === tokenId ? 'rgb(120, 50, 5)' : '#999',
                    textShadow: token.id === tokenId ? '0 2px 2px rgba(250, 227, 133, 1)' : 'none',
                    gap: 10,
                    display: 'flex',
                    position: 'relative',
                  }}
                >
                  <img
                    height="80.26"
                    width="100"
                    src="/images/blank.png"
                    style={{ backgroundColor: '#CCC', display: 'block' }}
                  />
                  {(token.id !== tokenId || !isSpinning) && (
                    <img
                      width="100"
                      src={`https://pepe-data-2.vercel.app/images/${tokenId}?rand=${rand}`}
                      style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
                    />
                  )}
                  {token.id === tokenId && isSpinning && (
                    <div
                      style={{
                        alignItems: 'center',
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        left: 40.13,
                        position: 'absolute',
                        top: 0,
                      }}
                    >
                      <CircularProgress size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '.6em', padding: '0 5px' }}>
                    {token.traits.find((t) => t.folder === 'frog')?.value || 'Frog'} with{' '}
                    {(() => {
                      const traits = token.traits
                        .filter((t) => t.folder !== 'bg')
                        .filter((t) => t.folder !== 'frog')
                        .map(
                          (t) =>
                            `${t.value}${
                              t.value.toLowerCase().includes(t.folder.toLowerCase().slice(0, -1))
                                ? ''
                                : ` ${t.folder}`
                            }`,
                        );
                      const last = traits.pop();

                      return traits.join(', ') + ' and ' + last;
                    })()}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {isInitialized && (
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <Clickable
                disabled={page < 2}
                onClick={() => setPage(page - 1)}
                style={{ width: 'auto' }}
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
                disabled={page > Math.ceil(Number((balanceOf.data as bigint) / BigInt(10)))}
                onClick={() => setPage(page + 1)}
                style={{ width: 'auto' }}
              >
                &raquo;
              </Clickable>
            </div>
          )}
        </div>
      )}

      {modalType === 'warning' && (
        <Modal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxWidth: 400,
              textAlign: 'center',
            }}
          >
            <h2>
              WARNING: You are about to
              <br />
              respin this Pepe
            </h2>
            <p>
              You will get a new random Pepe in place of this one, BUT CAREFUL!! This one will go
              back into the pool of available Pepes and you won&apos;t be able to get this one back!
            </p>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}
            >
              <Button
                color="secondary"
                onClick={() => setModalType('')}
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
                  spin.mutate();
                  setModalType('');
                }}
                style={{
                  width: '50%',
                }}
              >
                Respin
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {modalType === 'sign' && (
        <Modal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxWidth: 400,
              textAlign: 'center',
            }}
          >
            <h2>Respin for Another Pepe</h2>
            <p>
              To replace this Pepe with another Pepe, you can respin an unlimited number of times
              until you find the Pepe you like!
            </p>
            <p>To get started, sign a message to verify that you own this wallet.</p>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 0 0' }}
            >
              <Button
                color="secondary"
                onClick={() => setModalType('')}
                style={{
                  width: '50%',
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                disabled={signer.isPending || prepare.isPending || sign.isPending}
                onClick={() => {
                  prepare.mutate();
                }}
                style={{
                  width: '50%',
                }}
              >
                {signer.isPending || prepare.isPending || sign.isPending ? 'Waiting...' : 'Sign'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {modalType === 'welcome' && (
        <Modal>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              maxWidth: 400,
              width: '100%',
            }}
          >
            <h1>Welcome</h1>
            <p>Some text...</p>
            <Button
              color="primary"
              onClick={() => {
                localStorage.setItem('dismissWelcome', 'true');
                setModalType('');
              }}
              style={{
                width: '100%',
              }}
            >
              Got it!
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
``;
