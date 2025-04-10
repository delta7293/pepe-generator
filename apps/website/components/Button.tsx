import { CSSProperties, ReactNode } from 'react';

import styles from './Button.module.scss';

interface Props {
  children?: ReactNode;
  color?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Button({ children, color, disabled, onClick, style }: Props) {
  return (
    <button
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
      style={
        color === 'secondary'
          ? {
              backgroundImage: 'linear-gradient(160deg, #666, #999, #ccc, #999, #666)',
              color: 'black',
              boxShadow: `0 3px 6px rgba(0, 0, 0, 0.16),
              0 3px 6px rgba(50, 50, 50, 0.4),
              inset 0 -2px 5px 1px #999,
              inset 0 -1px 1px 3px #CCC`,
              borderColor: '#666',
              opacity: disabled ? '0.5' : 1,
              textShadow: '0 2px 2px #999',
              ...style,
            }
          : {
              opacity: disabled ? '0.5' : 1,
              ...style,
            }
      }
    >
      {children}
    </button>
  );
}
