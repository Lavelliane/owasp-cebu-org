import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    
    // Get stats
    const [totalCTFs, totalUsers] = await Promise.all([
      prisma.cTF.count(),
      prisma.user.count(),
    ]);
    
    return NextResponse.json({
      totalCTFs,
      totalUsers,
    });
  } catch (error) {
    console.error('Error retrieving stats:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve stats' },
      { status: 500 }
    );
  }
} 