import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || url.searchParams.get('title');
  const type = url.searchParams.get('type') || 'general';
  const pageParam = url.searchParams.get('page');

  const page = parseInt(pageParam || '1', 10);
  const pageSize = 20;

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    // Attempt to enable unaccent extension if not already enabled.
    // This requires appropriate DB permissions.
    try {
      await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS unaccent');
    } catch (e) {
      console.warn('Could not create unaccent extension, search might not be accent-insensitive:', e);
    }

    const searchPattern = `%${query}%`;
    const offset = (page - 1) * pageSize;

    let whereClause = Prisma.sql``;

    if (type === 'title') {
      whereClause = Prisma.sql`unaccent(titulo) ILIKE unaccent(${searchPattern})`;
    } else if (type === 'author') {
      whereClause = Prisma.sql`unaccent(autor) ILIKE unaccent(${searchPattern})`;
    } else {
      whereClause = Prisma.sql`unaccent(titulo) ILIKE unaccent(${searchPattern}) OR unaccent(autor) ILIKE unaccent(${searchPattern})`;
    }

    // 1. Get IDs of matching books using raw SQL to leverage unaccent
    const idsResult = await prisma.$queryRaw<{ id: number }[]>`
      SELECT id FROM libro
      WHERE ${whereClause}
      ORDER BY id ASC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    // 2. Get total count for pagination
    const countResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM libro
      WHERE ${whereClause}
    `;
    const totalCount = Number(countResult[0]?.count || 0);

    // 3. Fetch full book objects using Prisma to get correct type mapping
    const ids = idsResult.map(row => row.id);
    const books = await prisma.book.findMany({
      where: {
        id: { in: ids }
      }
    });

    // Restore order (findMany "in" doesn't guarantee order)
    const booksMap = new Map(books.map(b => [b.id, b]));
    const orderedBooks = ids.map(id => booksMap.get(id)).filter(Boolean);

    return NextResponse.json({
      books: orderedBooks,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json({ error: 'Failed to search books' }, { status: 500 });
  }
}
