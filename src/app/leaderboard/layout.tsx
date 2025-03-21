import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard | OWASP Cebu',
  description: 'See the top CTF players in the OWASP Cebu community.',
};

export default function LeaderboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
} 