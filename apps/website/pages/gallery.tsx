import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Header from '@/components/Header';
import Slots from '@/components/Slots';
import MintModal from '@/components/modals/MintModal';
import PEPE_NFT_ABI from '@/constants/PEPE_NFT_ABI';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';

export default function HomePage() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const balanceOf = useReadContract({
    address: process.env.NEXT_PUBLIC_PEPLICATOR_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: PEPE_NFT_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 5000,
    },
  });

  const [showModal, setShowModal] = useState(false);

  if (!address || !balanceOf.data) {
    return (
      <>
        <div
          style={{
            alignItems: 'center',
            backgroundImage: 'url(/images/bg.png)',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100dvh',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '40px 10px',
              boxShadow: `0 6px 6px hsl(0deg 0% 0% / 0.3)`,
            }}
          >
            <video
              autoPlay
              loop
              playsInline
              muted
              src="/videos/title.mp4"
              style={{
                maxWidth: '800px',
                width: '100%',
              }}
            />
            {!address && (
              <Button color="primary" onClick={() => openConnectModal?.()}>
                Connect Wallet
              </Button>
            )}
            {address && (
              <Button color="primary" onClick={() => setShowModal(true)}>
                Get Started
              </Button>
            )}
          </div>
        </div>
        <Footer />
        {showModal && <MintModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <Header />
      <Gallery />
      <Footer />
    </>
  );
}
