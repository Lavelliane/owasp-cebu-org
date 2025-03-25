'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  lastSubmission: Date | null;
  solvedChallenges: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const page = Number(searchParams?.get('page') || '1');
  const perPage = 20;
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?page=${page}&perPage=${perPage}`);
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users);
          setTotalUsers(data.total);
          setTotalPages(Math.ceil(data.total / perPage));
        } else {
          console.error('Failed to fetch leaderboard:', data.error);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [page]);
  
  // Prepare chart data for top 5 users
  const chartData = {
    labels: users.slice(0, 5).map(user => user.name),
    datasets: [
      {
        label: 'Points',
        data: users.slice(0, 5).map(user => user.points),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 5 Players',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/" 
          className="text-gray-300 hover:text-white flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        <div></div> {/* Empty div for flex alignment */}
      </div>
      
      {/* Chart for Top 5 Players */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
        <div className="h-80">
          {users.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No data available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Players Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="bg-gray-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">All Players</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-400">Loading leaderboard...</p>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Solved Challenges
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Last Submission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {(page - 1) * perPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {user.points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {user.solvedChallenges}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(user.lastSubmission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{(page - 1) * perPage + 1}</span> to{' '}
                    <span className="font-medium text-white">
                      {Math.min(page * perPage, totalUsers)}
                    </span>{' '}
                    of <span className="font-medium text-white">{totalUsers}</span> results
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/leaderboard?page=${page > 1 ? page - 1 : 1}`}
                    className={`inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-sm font-medium ${
                      page <= 1
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-white hover:bg-gray-700'
                    }`}
                    aria-disabled={page <= 1}
                  >
                    Previous
                  </Link>
                  <Link
                    href={`/leaderboard?page=${page < totalPages ? page + 1 : totalPages}`}
                    className={`inline-flex items-center px-4 py-2 border border-gray-700 rounded-md text-sm font-medium ${
                      page >= totalPages
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-white hover:bg-gray-700'
                    }`}
                    aria-disabled={page >= totalPages}
                  >
                    Next
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-400">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
} 