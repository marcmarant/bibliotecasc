'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Book } from '@prisma/client'
import { BookImage } from '@/components/BookImage'

interface BookGridProps {
  books: Book[]
}

export const BookGrid = ({ books }: BookGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4">
      {books.map((book) => (
        <Link href={`/book/${book.id}`} key={book.id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
              <BookImage
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/cmusantacruz/book_photos/${book.photo}`}
                alt={book.title}
                fill
                className="w-full h-full"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <div className="p-2 md:p-4">
              <h3 className="font-semibold text-sm truncate">{book.title}</h3>
              {book.author && book.author !== 'NaN' && (
                <p className="text-sm text-muted-foreground truncate">{book.author}</p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
