'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CTF {
  id: string;
  title: string;
  category: string;
  score: number;
}

export default function CTFsPage() {
  const [ctfs, setCtfs] = useState<CTF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCTFs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/ctfs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }
        
        const data = await response.json();
        setCtfs(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCTFs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/ctfs/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete challenge');
      }
      
      // Remove the deleted CTF from the state
      setCtfs(ctfs.filter(ctf => ctf.id !== id));
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">CTF Challenges</h1>
        <Link 
          href="/admin/ctfs/new" 
          className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Add New Challenge
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-400">Loading challenges...</p>
        </div>
      ) : ctfs.length === 0 ? (
        <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400 mb-4">No challenges found</p>
          <Link
            href="/admin/ctfs/new"
            className="text-white hover:underline"
          >
            Create your first challenge
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Title
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Category
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Score
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ctfs.map((ctf) => (
                <tr key={ctf.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {ctf.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ctf.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {ctf.score}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/ctfs/${ctf.id}/edit`}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(ctf.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 