import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';

interface CTF {
  id: string;
  title: string;
  description: string;
  hint?: string | null;
  category: string;
  score: number;
  solvedBy: { userId: string }[];
}

export default async function CTFsPage() {
  const session = await getServerSession();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Get user with solved CTFs
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      solvedCTFs: {
        select: { ctfId: true }
      }
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  // Get all CTFs with solved status
  const ctfs = await prisma.cTF.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      hint: true,
      category: true,
      score: true,
      solvedBy: {
        where: { userId: user.id },
        select: { userId: true }
      }
    },
    orderBy: [
      { createdAt: 'desc' }
    ]
  });

  // Group CTFs by category
  const ctfsByCategory = ctfs.reduce((acc, ctf) => {
    if (!acc[ctf.category]) {
      acc[ctf.category] = [];
    }
    acc[ctf.category].push(ctf);
    return acc;
  }, {} as Record<string, CTF[]>);

  const isSolved = (ctf: CTF) => {
    return ctf.solvedBy.some(solved => solved.userId === user.id);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/" 
          className="text-gray-300 hover:text-white flex items-center"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white">CTF Challenges</h1>
        <div className="bg-gray-800 px-4 py-2 rounded-md">
          <span className="text-gray-400 mr-2">Your Points:</span>
          <span className="text-white font-bold">{user.points}</span>
        </div>
      </div>

      {Object.keys(ctfsByCategory).length === 0 ? (
        <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
          <p className="text-gray-400">No challenges available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(ctfsByCategory).map(([category, categoryCTFs]) => (
            <div key={category} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-6 py-3">
                <h2 className="text-xl font-semibold text-white">{category}</h2>
              </div>
              <div className="divide-y divide-gray-800">
                {categoryCTFs.map((ctf) => (
                  <Link
                    key={ctf.id}
                    href={`/ctfs/${ctf.id}`}
                    className="block px-6 py-4 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-white flex items-center">
                          {ctf.title}
                          {isSolved(ctf) && (
                            <span className="ml-2 px-2 py-0.5 bg-green-900 text-green-300 text-xs rounded-full">
                              Solved
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 mt-1 line-clamp-2">{ctf.description}</p>
                      </div>
                      <div className="bg-gray-800 px-3 py-1 rounded-md text-white font-medium">
                        {ctf.score} pts
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
} 