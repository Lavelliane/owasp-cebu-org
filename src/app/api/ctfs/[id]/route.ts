import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user to check if they've solved this CTF
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get the CTF
    const ctf = await prisma.cTF.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        hint: true,
        category: true,
        score: true,
        solvedBy: {
          where: { userId: user.id }
        }
      }
    });
    
    if (!ctf) {
      return NextResponse.json({ message: 'CTF not found' }, { status: 404 });
    }
    
    // Format the response
    return NextResponse.json({
      ...ctf,
      isSolved: ctf.solvedBy.length > 0
    });
  } catch (error) {
    console.error('Error retrieving CTF:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve CTF' },
      { status: 500 }
    );
  }
} 