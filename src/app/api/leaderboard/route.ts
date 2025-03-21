import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pagination parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    
    // Validate pagination parameters
    if (isNaN(page) || page < 1 || isNaN(perPage) || perPage < 1 || perPage > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    // Get total count of users
    const totalUsers = await prisma.user.count();

    // Fetch paginated users with solved challenges count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        solvedCTFs: {
          select: {
            id: true,
            solvedAt: true,
          },
          orderBy: {
            solvedAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            solvedCTFs: true,
          },
        },
      },
      orderBy: [
        { points: 'desc' },
        { name: 'asc' },
      ],
      skip: (page - 1) * perPage,
      take: perPage,
    });

    // Transform data for frontend consumption
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.points,
      lastSubmission: user.solvedCTFs.length > 0 ? user.solvedCTFs[0]?.solvedAt : null,
      solvedChallenges: user._count.solvedCTFs,
    }));

    return NextResponse.json({
      users: transformedUsers,
      total: totalUsers,
      page,
      perPage,
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
} 