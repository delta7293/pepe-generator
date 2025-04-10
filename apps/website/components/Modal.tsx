import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { isMobile, isTablet } from 'react-device-detect';

interface Props {
  children: ReactNode;
  onClose?: () => void;
}

export default function Modal({ children, onClose }: Props) {
  return createPortal(
    <div
      style={{
        background: 'rgba(0,0,0,.5)',
        display: 'flex',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        minHeight: '100dvh',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 40,
          borderRadius: 20,
          position: 'relative',
          boxShadow: `0 6px 6px hsl(0deg 0% 0% / 0.3)`,
          transform: isMobile ? 'scale(0.8)' : undefined,
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              alignItems: 'center',
              background: '#DDD',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              fontSize: '1em',
              height: 40,
              justifyContent: 'center',
              margin: 0,
              padding: 0,
              position: 'absolute',
              right: 5,
              top: 5,
              width: 40,
            }}
          >
            X
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
