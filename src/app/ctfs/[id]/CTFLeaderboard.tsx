'use client';

import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SolverData {
  userId: string;
  userName: string;
  solveTimeSeconds: number;
  solvedAt: string;
}

export default function CTFLeaderboard({ ctfId }: { ctfId: string }) {
  const [solvers, setSolvers] = useState<SolverData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/ctfs/${ctfId}/solvers`);
        const data = await response.json();
        
        if (response.ok) {
          // Sort by solve time (ascending)
          const sortedSolvers = data.solvers.sort(
            (a: SolverData, b: SolverData) => a.solveTimeSeconds - b.solveTimeSeconds
          );
          setSolvers(sortedSolvers);
        } else {
          console.error('Failed to fetch solvers:', data.error);
        }
      } catch (error) {
        console.error('Error fetching solvers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSolvers();
  }, [ctfId]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Prepare chart data - use only top 10 solvers for clarity
  const chartData = {
    labels: solvers.slice(0, 10).map(solver => solver.userName),
    datasets: [
      {
        label: 'Solve Time',
        data: solvers.slice(0, 10).map(solver => solver.solveTimeSeconds),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // This makes the chart horizontal
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      title: {
        display: true,
        text: 'Fastest Solvers',
        color: 'white',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            const solveTime = context.raw;
            return `Time: ${formatTime(solveTime)}`;
          }
        }
      }
    },
    scales: {
      x: {
        min: 0, // Start at 0
        title: {
          display: true,
          text: 'Time (seconds)',
          color: 'rgba(255, 255, 255, 0.7)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: any) {
            return formatTime(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Players',
          color: 'rgba(255, 255, 255, 0.7)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Speed Leaderboard</h2>
        <p className="text-sm text-gray-400 mt-1">Time measured from when player starts the challenge until submission of correct flag</p>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-400">Loading leaderboard...</p>
        </div>
      ) : solvers.length > 0 ? (
        <>
          {/* Chart for visualization */}
          <div className="p-6 border-b border-gray-800">
            <div className="h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Table for detailed data */}
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
                    Time to Solve
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {solvers.map((solver, index) => (
                  <tr key={solver.userId} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {solver.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatTime(solver.solveTimeSeconds)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(solver.solvedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-400">No one has solved this challenge yet. Be the first!</p>
        </div>
      )}
    </div>
  );
} 