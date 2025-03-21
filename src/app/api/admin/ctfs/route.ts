import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

// Validation schema for CTF creation
const ctfSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  hint: z.string().optional(),
  link: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  flag: z.string().min(1, 'Flag is required'),
  score: z.number().min(0, 'Score must be at least 0').max(999999, 'Score must be at most 999999')
});

// GET - Retrieve all CTFs
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
    
    // Fetch all CTFs
    const ctfs = await prisma.cTF.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(ctfs);
  } catch (error) {
    console.error('Error retrieving CTFs:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve CTFs' },
      { status: 500 }
    );
  }
}

// POST - Create a new CTF
export async function POST(request: NextRequest) {
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
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = ctfSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { title, description, hint, link, category, flag, score } = validationResult.data;
    
    // Create the CTF
    const ctf = await prisma.cTF.create({
      data: {
        title,
        description,
        hint,
        link,
        category,
        flag,
        score,
      },
    });
    
    return NextResponse.json(ctf, { status: 201 });
  } catch (error) {
    console.error('Error creating CTF:', error);
    return NextResponse.json(
      { message: 'Failed to create CTF' },
      { status: 500 }
    );
  }
} 