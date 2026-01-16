'use client'

import React from 'react';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@prisma/client';
import { IoArrowBack } from 'react-icons/io5';
import { Spinner } from '@/components/ui/spinner';
import { BookImage } from '@/components/BookImage';

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<null | Book>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/book/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) { // TODO: manejar el error
          return notFound();
        }
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Failed to fetch book", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (book) return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="w-full flex justify-start mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <IoArrowBack className="w-6 h-6" />
          </Button>
        </Link>
      </div>

      <div className="flex-1 grid md:grid-cols-2 gap-8 items-start max-w-6xl mx-auto w-full">
        {/* Image Container */}
        <div className="w-full max-w-[400px] mx-auto relative aspect-[2/3] overflow-hidden rounded-lg shadow-md bg-muted">
          <BookImage
            src={book.photo.startsWith('http') ? book.photo : `${process.env.NEXT_PUBLIC_SERVER_URL}/assets/cmusantacruz/book_photos/${book.photo}`}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details Container */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 break-words">{book.title}</h1>
            {/* @ts-ignore - authors from Google API */}
            {book.authors && book.authors.length > 0 ? (
              <h2 className="text-xl md:text-2xl text-muted-foreground">
                {/* @ts-ignore */}
                {book.authors.join(', ')}
              </h2>
            ) : book.author && book.author !== 'NaN' && (
              <h2 className="text-xl md:text-2xl text-muted-foreground">{book.author}</h2>
            )}

            {/* @ts-ignore - categories from Google API */}
            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {book.categories.map((cat: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-lg border p-4 bg-card/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Año de publicación</span>
                {/* @ts-ignore - publishedDate from Google API */}
                <span className="text-base font-semibold">{book.publishedDate || book.publishedAt}</span>
              </div>
              {/* @ts-ignore - pageCount from Google API */}
              {book.pageCount && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground block">Páginas</span>
                  <span className="text-base font-semibold">{book.pageCount}</span>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Género</span>
                <span className="text-base font-semibold">{book.genre}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Estante</span>
                <span className="text-base font-semibold">{book.location}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block">Editorial</span>
                <span className="text-base font-semibold">{book.publisher}</span>
              </div>
            </div>
          </div>

          {book.synopsis && (
            <div className="rounded-lg border p-4 bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Sinopsis</span>
              <p className="text-base leading-relaxed">{book.synopsis}</p>
            </div>
          )}

          {book.observations && book.observations !== 'NaN' && (
            <div className="rounded-lg border p-4 bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground block mb-1">Observaciones</span>
              <p className="text-base">{book.observations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
