import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Role } from '@prisma/client';

// IMPORTANT: This endpoint is for development/testing purposes only!
// In a production environment, you should remove this or secure it properly.

export async function POST(request: NextRequest) {
  try {
    // In development mode only
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { message: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN },
    });

    return NextResponse.json({
      message: 'User promoted to admin successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { message: 'Failed to promote user' },
      { status: 500 }
    );
  }
} 