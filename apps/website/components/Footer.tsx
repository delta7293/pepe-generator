import Link from 'next/link';
import { isMobile, isTablet } from 'react-device-detect';
import Modal from './Modal';
import { useState } from 'react';

export default function Footer() {
  const [modalType, setModalType] = useState<'' | 'about'>('');

  return (
    <>
      <footer
        style={{
          background: 'white',
          borderRadius: 20,
          display: 'flex',
          position: isMobile ? 'static' : 'fixed',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: 40,
          bottom: 10,
          right: 10,
          padding: isMobile ? 20 : '20px 20px 20px 40px',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex' }}>
          <img src="/icons/chainsawlogo.svg" style={{ height: 24 }} />
          <img src="/icons/x.svg" style={{ height: 24 }} />
          <img src="/icons/pepehead.svg" style={{ height: 24 }} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '.75em',
            gap: 40,
            textTransform: 'lowercase',
          }}
        >
          <button
            onClick={() => setModalType('about')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1em',
              margin: 0,
              padding: 0,
              textTransform: 'lowercase',
            }}
          >
            About
          </button>
          <Link href="/docs/peplicator.pdf" target="_blank">
            Terms
          </Link>
          <Link href="https://discord.com/invite/qKBK3VADeZ" target="_blank">
            <img src="/icons/discord.svg" style={{ height: 14 }} />
          </Link>
          <Link href="https://twitter.com/Matt_Furie" target="_blank">
            <img src="/icons/twitter.svg" style={{ height: 14 }} />
          </Link>
        </div>
      </footer>
      {modalType === 'about' && (
        <Modal onClose={() => setModalType('')}>
          <h1>About The Peplicator</h1>
          <p>
            Welcome to Peplicator.fun, the first generative art project from Pepe&apos;s creator,
            Matt Furie.
          </p>
          <p>Unique 1/1 Pepe NFTs - Open Mint 24 Hours Only!</p>
          <p>FRIDAY MARCH 8 3PM EST - SATURDAY MARCH 9 3PM EST</p>
          <p>Minting closes forever on SATURDAY, and collection size will be locked forever</p>
          <p>
            Mint your Pepe, and respin for infinite hilarious options until you find your favorites
          </p>
          <p>
            Simple, chaotic, raw or sleek, sad or happy, explore Pepe in all his forms and mint what
            you love!
          </p>
        </Modal>
      )}
    </>
  );
}
