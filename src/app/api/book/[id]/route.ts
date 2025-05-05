import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string }}) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new NextResponse('Invalid book ID', { status: 400 });
  }
  try {
    const book = await prisma.book.findUnique({
      where: { id }
    });
    console.log('Book details:', book);
    if (!book) {
      return new NextResponse('Book not found', { status: 404 })
    }
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse('Error fetching books', { status: 500 });
  }
}
