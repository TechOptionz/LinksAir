'use client';

import { createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

export const QuoteCtx = createContext<{ open: () => void; close: () => void; isOpen: boolean }>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export function useQuote() {
  return useContext(QuoteCtx);
}

/** Same behaviour as the original submitQuote: log, reset, close drawer, go to /thank-you */
export function useLeadSubmit() {
  const router = useRouter();
  const { close } = useQuote();
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    console.log('Enquiry', Object.fromEntries(fd.entries()));
    form.reset();
    close();
    router.push('/thank-you');
  };
}
