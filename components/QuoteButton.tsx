'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useQuote } from './QuoteContext';

export default function QuoteButton({
  style,
  className,
  children,
  closeMenuFirst,
}: {
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  closeMenuFirst?: () => void;
}) {
  const { open } = useQuote();
  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        closeMenuFirst?.();
        open();
      }}
    >
      {children}
    </button>
  );
}
