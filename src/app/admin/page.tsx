'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCTFs: 0,
    totalUsers: 0
  });
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would fetch these stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">CTF Challenges</h3>
          <p className="text-3xl font-bold text-white">{stats.totalCTFs}</p>
          <Link 
            href="/admin/ctfs" 
            className="mt-4 inline-block text-sm text-gray-300 hover:text-white"
          >
            Manage challenges →
          </Link>
        </div>
        
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-2">Users</h3>
          <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link 
          href="/admin/ctfs/new" 
          className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Create New Challenge
        </Link>
      </div>
    </div>
  );
} 