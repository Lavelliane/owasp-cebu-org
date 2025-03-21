import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to view this data' },
        { status: 401 }
      );
    }
    
    const { id: ctfId } = await params;
    
    // Get the CTF
    const ctf = await prisma.cTF.findUnique({
      where: { id: ctfId }
    });
    
    if (!ctf) {
      return NextResponse.json(
        { error: 'CTF not found' },
        { status: 404 }
      );
    }
    
    // Get all solvers for this CTF with their solve times
    const solvers = await prisma.solvedCTF.findMany({
      where: {
        ctfId,
        solvedAt: { not: undefined }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { solvedAt: 'asc' }
    });
    
    // Calculate solve time in seconds from start time to solve time
    const solversWithTime = solvers
      .filter(solver => 
        solver.solvedAt !== null && 
        solver.solvedAt !== undefined && 
        solver.startedAt !== null &&
        solver.startedAt !== undefined
      )
      .map(solver => {
        try {
          const solveTimeSeconds = Math.floor(
            (solver.solvedAt!.getTime() - solver.startedAt.getTime()) / 1000
          );
          
          return {
            userId: solver.user.id,
            userName: solver.user.name,
            solveTimeSeconds,
            solvedAt: solver.solvedAt,
          };
        } catch (error) {
          console.error(`Error processing solver ${solver.user.name}:`, error);
          // Return a default object with a large solve time to push it to the bottom of the leaderboard
          return {
            userId: solver.user.id,
            userName: solver.user.name,
            solveTimeSeconds: Number.MAX_SAFE_INTEGER,
            solvedAt: solver.solvedAt,
          };
        }
      })
      // Filter out any items with MAX_SAFE_INTEGER (error records)
      .filter(item => item.solveTimeSeconds !== Number.MAX_SAFE_INTEGER);
    
    return NextResponse.json({ solvers: solversWithTime });
    
  } catch (error) {
    console.error('Error fetching CTF solvers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solvers' },
      { status: 500 }
    );
  }
} 