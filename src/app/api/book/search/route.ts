import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const titleQuery = url.searchParams.get('title');
  const pageParam = url.searchParams.get('page');

  const page = parseInt(pageParam || '1', 10);
  const pageSize = 20;

  if (!titleQuery) {
    return NextResponse.json({ error: 'Title query parameter is required' }, { status: 400 });
  }

  try {
    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where: {
          title: {
            contains: titleQuery,
            mode: 'insensitive'
          },
        },
        skip: (page - 1)*pageSize,
        take: pageSize,
      }),
      prisma.book.count({
        where: {
          title: {
            contains: titleQuery,
            mode: 'insensitive'
          },
        },
      }),
    ]);

    return NextResponse.json({
      books,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json({ error: 'Failed to search books' }, { status: 500 });
  }
}
