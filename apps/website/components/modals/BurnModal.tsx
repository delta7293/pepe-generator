import { useEffect, useState } from 'react';
import Modal from '../Modal';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import PEPE_SALES_ABI from '@/constants/PEPE_SALES_ABI';
import PEPE_EDITIONS_ABI from '@/constants/PEPE_EDITIONS_ABI';
import { formatEther, parseEther } from 'viem';
import Button from '../Button';
import Link from 'next/link';
import GroupDropDown from '../GroupDropDown';
import ZOGZ_EDITIONS_ABI from '@/constants/ZOGZ_EDITIONS_ABI';
import Clickable from '../Clickable';

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

export default function BurnModal({ onClose }: Props) {
  const { address } = useAccount();

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

  const [quantity, setQuantity] = useState('1');
  const [selectedEdition, setSelectedEdition] = useState('');

  useEffect(() => {
    if (setApprovalForAll.isSuccess) {
      pepeIsApprovedForAll.refetch();
    }
  }, [setApprovalForAll.isSuccess]);

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

  const pepeIsApprovedForAllError = (() => {
    if (!pepeIsApprovedForAll.error) {
      return '';
    }

    if (pepeIsApprovedForAll.error.message.includes('User denied transaction signature')) {
      return 'User denied transaction signature.';
    }

    console.error(pepeIsApprovedForAll.error.message);

    return 'Something weird happened. Try again.';
  })();

  const zogzIsApprovedForAllError = (() => {
    if (!zogzIsApprovedForAll.error) {
      return '';
    }

    if (zogzIsApprovedForAll.error.message.includes('User denied transaction signature')) {
      return 'User denied transaction signature.';
    }

    console.error(zogzIsApprovedForAll.error.message);

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

  if (burnForCredits.isSuccess) {
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
          }}
        >
          <h1>You did it!</h1>
          <p>You received some credits and spins.</p>
          <Button
            color="primary"
            onClick={onClose}
            style={{
              width: '50%',
            }}
          >
            Cool
          </Button>
        </div>
      </Modal>
    );
  }

  if (
    pepeBalanceOfBatch.isPending ||
    pepeIsApprovedForAll.isPending ||
    zogzBalanceOfBatch.isPending ||
    zogzIsApprovedForAll.isPending
  ) {
    return <Modal>Loading...</Modal>;
  }

  const ownedPepes = pepes.filter(
    (_, index) => (pepeBalanceOfBatch.data as bigint[])[index] > BigInt(0),
  );

  const ownedZogz = zogz.filter(
    (_, index) => (zogzBalanceOfBatch.data as bigint[])[index] > BigInt(0),
  );

  return (
    <Modal>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: '1em', gap: 20 }}>
        <h1 style={{ fontSize: '2em', margin: 0, padding: 0, textAlign: 'center' }}>
          Get More Credits
        </h1>
        <p style={{ color: '#666', margin: 0, padding: 0, textAlign: 'center' }}>
          Burn{' '}
          <Link href="https://www.pepe.fun/" style={{ color: 'green' }} target="_blank">
            Pepe OE&apos;s
          </Link>{' '}
          or{' '}
          <Link href="https://www.zogz.fun/" style={{ color: 'green' }} target="_blank">
            ZOGZ OE&apos;s
          </Link>{' '}
          for <b style={{ color: 'black' }}>1/2 off mints</b> and{' '}
          <b style={{ color: 'black' }}>extra spins</b>
        </p>
        {!ownedPepes.length && !ownedZogz.length && (
          <div style={{ fontSize: '1.5em', textAlign: 'center' }}>
            You don&apos;t own any PEPE or ZOGZ Editions.
          </div>
        )}
        {(ownedPepes.length > 0 || ownedZogz.length > 0) && (
          <GroupDropDown
            groups={[
              {
                label: 'Pepe Open Editions',
                name: 'pepe',
                items: ownedPepes.map((edition) => ({
                  image: edition.image,
                  label: edition.name,
                  note: `${edition.credits} credit${edition.credits === 1 ? '' : 's'} + ${
                    edition.credits
                  } spin${edition.credits === 1 ? '' : 's'}`,
                  value: `pepe-${edition.id}`,
                })),
              },
              {
                label: 'ZOGZ Open Editions',
                name: 'zogz',
                items: ownedZogz.map((edition) => ({
                  image: edition.image,
                  label: edition.name,
                  note: `${edition.credits} credit${edition.credits === 1 ? '' : 's'} + ${
                    edition.credits
                  } spin${edition.credits === 1 ? '' : 's'}`,
                  value: `zogz-${edition.id}`,
                })),
              },
            ]}
            onChange={(value) => setSelectedEdition(value)}
            value={selectedEdition}
          />
        )}
        <div>
          {((selectedEdition.startsWith('pepe') && !pepeIsApprovedForAll.data) ||
            (selectedEdition.startsWith('zogz') && !zogzIsApprovedForAll.data)) && (
            <div style={{ color: 'red' }}>
              Before you can burn this {selectedEdition.split('-')[0].toUpperCase()} Open Edition,
              you must allow the Peplicator contract:
              <Clickable
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
                style={{
                  color: 'darkred',
                  display: 'inline-flex',
                  fontSize: '1em',
                }}
              >
                Approve Burn
              </Clickable>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 20, margin: '20px 0 0 0' }}>
          <Button
            color="secondary"
            onClick={onClose}
            style={{
              width: ownedPepes.length || ownedZogz.length ? '50%' : '100%',
            }}
          >
            Never mind
          </Button>
          {(ownedPepes.length > 0 || ownedZogz.length > 0) && (
            <Button
              color="primary"
              disabled={
                !selectedEdition ||
                (selectedEdition.startsWith('pepe') && !pepeIsApprovedForAll.data) ||
                (selectedEdition.startsWith('zogz') && !zogzIsApprovedForAll.data) ||
                burnForCredits.isPending
              }
              onClick={() => {
                if (!selectedEdition) {
                  return;
                }

                const [type, id] = selectedEdition.split('-');

                if (type === 'pepe') {
                  burnForCredits.writeContract({
                    address: process.env
                      .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                    abi: PEPE_SALES_ABI,
                    functionName: 'burnPepeEditionsForCredits',
                    args: [BigInt(id)],
                  });
                } else {
                  const edition = ownedPepes.find((e) => e.id === Number(id))!;

                  burnForCredits.writeContract({
                    address: process.env
                      .NEXT_PUBLIC_PEPLICATOR_SALES_CONTRACT_ADDRESS as `0x${string}`,
                    abi: PEPE_SALES_ABI,
                    functionName: 'burnZogzEditionsForCredits',
                    args: [BigInt(id)],
                  });
                }
              }}
              style={{
                width: '50%',
              }}
            >
              {burnForCredits.isPending ? 'Waiting...' : 'Burn, baby, Burn!'}
            </Button>
          )}
        </div>
        {burnForCreditsError && (
          <div style={{ color: 'red', textAlign: 'center' }}>{burnForCreditsError}</div>
        )}
        {setApprovalForAllError && <div style={{ color: 'red' }}>{setApprovalForAllError}</div>}
      </div>
    </Modal>
  );
}
