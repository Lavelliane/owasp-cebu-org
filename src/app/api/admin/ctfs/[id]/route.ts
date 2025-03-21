import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { Role } from '@prisma/client';

// Validation schema
const ctfUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  hint: z.string().optional(),
  link: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  flag: z.string().min(1, 'Flag is required').optional(),
  score: z.number().min(1, 'Score must be at least 1').max(1000, 'Score must be at most 1000').optional()
});

// Helper function to check admin authorization
async function checkAdminAuth() {
  const session = await getServerSession();
  if (!session || !session.user) {
    return { authorized: false, status: 401, message: 'Unauthorized' };
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });
  
  if (!user || user.role !== Role.ADMIN) {
    return { authorized: false, status: 403, message: 'Forbidden' };
  }
  
  return { authorized: true };
}

// GET - Retrieve a specific CTF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { message: authCheck.message },
        { status: authCheck.status }
      );
    }
    
    const { id } = await params;
    const ctf = await prisma.cTF.findUnique({
      where: { id },
    });
    
    if (!ctf) {
      return NextResponse.json(
        { message: 'CTF not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(ctf);
  } catch (error) {
    console.error('Error retrieving CTF:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve CTF' },
      { status: 500 }
    );
  }
}

// PUT - Update a specific CTF
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { message: authCheck.message },
        { status: authCheck.status }
      );
    }
    
    const { id } = await params;
    // Check if CTF exists
    const existingCTF = await prisma.cTF.findUnique({
      where: { id },
    });
    
    if (!existingCTF) {
      return NextResponse.json(
        { message: 'CTF not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = ctfUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const updateData = validationResult.data;
    
    // Update the CTF
    const updatedCTF = await prisma.cTF.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedCTF);
  } catch (error) {
    console.error('Error updating CTF:', error);
    return NextResponse.json(
      { message: 'Failed to update CTF' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific CTF
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json(
        { message: authCheck.message },
        { status: authCheck.status }
      );
    }
    
    const { id } = await params;
    // Check if CTF exists
    const existingCTF = await prisma.cTF.findUnique({
      where: { id },
    });
    
    if (!existingCTF) {
      return NextResponse.json(
        { message: 'CTF not found' },
        { status: 404 }
      );
    }
    
    // Delete the CTF
    await prisma.cTF.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'CTF deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting CTF:', error);
    return NextResponse.json(
      { message: 'Failed to delete CTF' },
      { status: 500 }
    );
  }
} 