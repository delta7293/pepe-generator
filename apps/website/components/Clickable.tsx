import { CSSProperties, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Clickable({ children, disabled, onClick, style }: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
