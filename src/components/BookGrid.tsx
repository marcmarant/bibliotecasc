'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Book } from '@prisma/client'

interface BookGridProps {
  books: Book[]
}

export const BookGrid = ({ books }: BookGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {books.map((book) => (
        <Link href={`/book/${book.id}`} key={book.id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/cmusantacruz/book_photos/${book.photo}`}
                alt={book.title}
                className="object-cover w-full h-full"
                width={200}
                height={300}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm truncate">{book.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{book.author}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
