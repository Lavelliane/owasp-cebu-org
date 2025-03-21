import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        solvedCTFs: {
          where: { 
            ctfId: id,
            solvedAt: { not: undefined }
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if already solved
    if (user.solvedCTFs.length > 0) {
      return NextResponse.json({
        message: 'You have already solved this challenge',
        correct: true
      });
    }

    // Get the CTF
    const ctf = await prisma.cTF.findUnique({
      where: { id }
    });
    
    if (!ctf) {
      return NextResponse.json({ message: 'CTF not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { flag } = body;
    
    if (!flag) {
      return NextResponse.json(
        { message: 'Flag is required' },
        { status: 400 }
      );
    }

    // Create a submission record
    const correct = flag.trim() === ctf.flag.trim();
    
    await prisma.submission.create({
      data: {
        flag,
        correct,
        userId: user.id,
        ctfId: ctf.id
      }
    });

    // If correct, mark as solved and update points
    if (correct) {
      try {
        await prisma.$transaction([
          // Upsert the SolvedCTF record with solvedAt timestamp
          prisma.solvedCTF.upsert({
            where: {
              userId_ctfId: {
                userId: user.id,
                ctfId: ctf.id
              }
            },
            update: {
              solvedAt: new Date()
            },
            create: {
              userId: user.id,
              ctfId: ctf.id,
              startedAt: new Date(),
              solvedAt: new Date()
            }
          }),
          // Update user points
          prisma.user.update({
            where: { id: user.id },
            data: {
              points: user.points + ctf.score
            }
          })
        ]);
      } catch (error) {
        console.error('Error updating SolvedCTF record:', error);
        // Continue without throwing, user still deserves the "correct" message
      }
    }
    
    return NextResponse.json({
      correct,
      message: correct 
        ? 'Correct flag! Points awarded.' 
        : 'Incorrect flag. Try again.'
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { message: 'Failed to process submission' },
      { status: 500 }
    );
  }
} 