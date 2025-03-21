'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PromoteUserPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({ message: '', type: null });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({
        message: 'Please enter an email address',
        type: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    setStatus({ message: 'Processing...', type: 'info' });
    
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to promote user');
      }
      
      setStatus({
        message: `User ${email} promoted to admin successfully!`,
        type: 'success'
      });
      setEmail('');
    } catch (error) {
      setStatus({
        message: error instanceof Error ? error.message : 'An error occurred',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Promote User to Admin</h1>
        <Link 
          href="/admin" 
          className="text-sm text-gray-300 hover:text-white"
        >
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-yellow-900/30 border border-yellow-800 rounded p-4 mb-6">
        <h2 className="text-yellow-300 font-medium">Development Tool Only</h2>
        <p className="text-yellow-200 text-sm mt-1">
          This tool is for development and testing purposes only. It allows you to quickly promote
          a user to admin role. Remove this page in production.
        </p>
      </div>
      
      {status.message && (
        <div 
          className={`mb-4 p-3 rounded ${
            status.type === 'success' ? 'bg-green-900/30 border border-green-800 text-green-300' :
            status.type === 'error' ? 'bg-red-900/30 border border-red-800 text-red-300' :
            'bg-blue-900/30 border border-blue-800 text-blue-300'
          }`}
        >
          {status.message}
        </div>
      )}
      
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <form onSubmit={handlePromote} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="email">
              User Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
              placeholder="Enter user email address"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Processing...' : 'Promote to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 