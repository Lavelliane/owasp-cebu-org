import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CTF Challenges | OWASP Cebu',
  description: 'Solve CTF challenges and earn points',
};

export default function CTFLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
} 