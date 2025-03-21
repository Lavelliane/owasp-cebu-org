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
    // Only include records where solvedAt is not null
    const solvers = await prisma.solvedCTF.findMany({
      where: {
        ctfId,
        NOT: {
          solvedAt: null
        }
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
      .map(solver => {
        try {
          if (!solver.solvedAt || !solver.startedAt) {
            return null;
          }
          
          const solveTimeSeconds = Math.floor(
            (solver.solvedAt.getTime() - solver.startedAt.getTime()) / 1000
          );
          
          // Make sure solve time is at least 1 second
          const adjustedTime = Math.max(solveTimeSeconds, 1);
          
          return {
            userId: solver.user.id,
            userName: solver.user.name,
            solveTimeSeconds: adjustedTime,
            solvedAt: solver.solvedAt,
          };
        } catch (error) {
          console.error(`Error processing solver ${solver.user.name}:`, error);
          return null;
        }
      })
      .filter(item => item !== null) as {
        userId: string;
        userName: string;
        solveTimeSeconds: number;
        solvedAt: Date;
      }[];
    
    return NextResponse.json({ solvers: solversWithTime });
    
  } catch (error) {
    console.error('Error fetching CTF solvers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solvers' },
      { status: 500 }
    );
  }
} 