import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return new NextResponse('Invalid book ID', { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: numericId },
    });
    if (!book) {
      return new NextResponse('Book not found', { status: 404 })
    }
    if (book.isbn && book.isbn !== 'NaN' && book.isbn !== 'null') {
      try {
        const googleRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}&key=${process.env.GOOGLE_BOOKS_API_KEY}`
        );
        const googleData = await googleRes.json();

        if (googleData.items && googleData.items.length > 0) {
          const volumeInfo = googleData.items[0].volumeInfo;
          const synopsis = volumeInfo.description;
          const photo = volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail;
          const pageCount = volumeInfo.pageCount;
          const publishedDate = volumeInfo.publishedDate;
          const authors = volumeInfo.authors;
          const categories = volumeInfo.categories;
          const publisher = volumeInfo.publisher;

          if (synopsis || photo || pageCount || publishedDate || authors || categories || publisher) {
            // Merge Google data with book data for the response only
            const bookWithGoogleData = {
              ...book,
              synopsis: synopsis || null,
              photo: photo || book.photo,
              pageCount: pageCount || null,
              publishedDate: publishedDate || book.publishedAt, // Prefer Google date
              authors: authors || (book.author ? [book.author] : []), // Prefer Google authors (array)
              categories: categories || null,
              publisher: publisher || book.publisher, // Prefer Google publisher
            };
            return NextResponse.json(bookWithGoogleData);
          }
        }
      } catch (error) {
        console.error('Error fetching data from Google Books:', error);
      }
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse('Error fetching books', { status: 500 });
  }
}
