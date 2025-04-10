import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';

import Button from './Button';
import BurnModal from './modals/BurnModal';
import MintModal from './modals/MintModal';
import { isMobile } from 'react-device-detect';

export default function Header() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [modalType, setModalType] = useState<'' | 'burn' | 'mint'>('');

  return (
    <>
      <header
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 20,
          justifyContent: 'space-between',
          padding: isMobile ? 20 : 0,
          position: isMobile ? 'static' : 'fixed',
          right: 20,
          top: 20,
          zIndex: 20,
        }}
      >
        {address && (
          <>
            {/* <Button color="primary" onClick={() => setModalType('mint')}>
              Mint More
            </Button> */}
            <div>{address.slice(0, 7) + '...' + address.slice(-5)}</div>
          </>
        )}

        {!address && (
          <Button color="primary" onClick={() => openConnectModal?.()}>
            Connect Wallet
          </Button>
        )}
      </header>
      {modalType === 'burn' && <BurnModal onClose={() => setModalType('')} />}
      {modalType === 'mint' && <MintModal onClose={() => setModalType('')} />}
    </>
  );
}
