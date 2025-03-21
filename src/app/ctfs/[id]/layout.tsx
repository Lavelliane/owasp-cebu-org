import { ReactNode } from 'react';
import Link from 'next/link';

export default function CTFDetailLayout({ children }: { children: ReactNode }) {
  return (
    <div>      
      <div className="mb-6">
        <Link 
          href="/ctfs" 
          className="text-gray-300 hover:text-white flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Challenges
        </Link>
      </div>
      {children}
    </div>
  );
} 