import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user to check their solved challenges
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        solvedCTFs: {
          select: { ctfId: true }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get all CTFs with information about which ones the user has solved
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
        { category: 'asc' },
        { score: 'asc' }
      ]
    });
    
    return NextResponse.json({
      ctfs,
      userPoints: user.points
    });
  } catch (error) {
    console.error('Error retrieving CTFs:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve CTFs' },
      { status: 500 }
    );
  }
} 