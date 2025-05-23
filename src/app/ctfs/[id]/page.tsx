import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import FlagSubmissionForm from './FlagSubmissionForm';
import CTFLeaderboard from './CTFLeaderboard';
import { SquareArrowOutUpRight } from 'lucide-react';

interface CTFDetails {
  id: string;
  title: string;
  description: string;
  hint: string | null;
  category: string;
  score: number;
  isSolved: boolean;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctf = await prisma.cTF.findUnique({
    where: { id },
    select: { title: true }
  });

  return {
    title: ctf ? `${ctf.title} | CTF Challenge` : 'CTF Challenge',
    description: 'OWASP Cebu CTF Challenge'
  };
}

export default async function CTFDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  const { id } = await params;
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Get user with solved CTFs
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      solvedCTFs: {
        where: { ctfId: id },
        select: { ctfId: true, solvedAt: true, startedAt: true }
      }
    }
  });
  
  if (!user) {
    throw new Error('User not found');
  }

  // Get the CTF details
  const ctf = await prisma.cTF.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      hint: true,
      category: true,
      score: true,
      link: true
    }
  });
  
  // Handle CTF not found
  if (!ctf) {
    notFound();
  }

  // Check if the user has started or solved this CTF
  const userCTF = user.solvedCTFs[0];
  const isStarted = !!userCTF;
  // Only consider it solved if solvedAt is not null
  const isSolved = isStarted && userCTF.solvedAt !== null;
  
  // Record start time if user hasn't started this challenge yet
  if (!isStarted) {
    await prisma.solvedCTF.create({
      data: {
        userId: user.id,
        ctfId: ctf.id,
        startedAt: new Date()
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <span className="text-xs font-medium px-2 py-1 bg-gray-700 rounded text-gray-300 mr-2">
              {ctf.category}
            </span>
            <span className="text-xs font-medium px-2 py-1 bg-gray-700 rounded text-white">
              {ctf.score} points
            </span>
          </div>
          {isSolved && (
            <span className="px-2 py-1 bg-green-900/50 text-green-300 text-sm rounded">
              Solved
            </span>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">{ctf.title}</h1>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 whitespace-pre-line">{ctf.description}</p>
          </div>

          {ctf.link && (
            <div className="mb-8">
              <p className="mr-2">Access the Challenge here:</p>
              <div className="flex items-center">
                <a 
                  href={ctf.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  
                  <span className="mr-2">Challenge URL</span>
                  <SquareArrowOutUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
          
          {ctf.hint && (
            <div className="mb-8">
              <details className="text-gray-400 group">
                <summary className="cursor-pointer hover:text-white underline text-sm">
                  View Hint
                </summary>
                <div className="mt-2 p-3 bg-gray-800 border border-gray-700 rounded">
                  <p className="text-gray-300 text-sm">{ctf.hint}</p>
                </div>
              </details>
            </div>
          )}
          
          {!isSolved ? (
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Submit Flag</h2>
              <FlagSubmissionForm ctfId={ctf.id} userId={user.id} />
            </div>
          ) : (
            <div className="border-t border-gray-800 pt-6">
              <div className="p-4 bg-green-900/30 border border-green-800 rounded">
                <p className="text-green-300 font-medium">
                  You have successfully solved this challenge!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* CTF Leaderboard */}
      <CTFLeaderboard ctfId={ctf.id} />
    </div>
  );
} 