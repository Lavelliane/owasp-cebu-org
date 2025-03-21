'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Leaderboard error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-red-300 mb-6">
          We couldn't load the leaderboard. Please try again later.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 transition"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
} 