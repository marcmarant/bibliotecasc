'use client'

import React from 'react';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@prisma/client';

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<null | Book>(null);

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}}/api/book/${id}`, {
        cache: 'no-store',
      });
      if (!res.ok) { // TODO: manejar el error
        return notFound();
      }
      const data = await res.json();
      setBook(data);
    }
    fetchBook();
  }, [id]);
  
  if (book) return (
    <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center h-[100vh]">
      <div className="w-full flex justify-start">
        <Link href="/">
          <Button variant="default" className="mb-6">← Volver</Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 justify-between items-center gap-8 max-w-[1500px] h-full">
        <div className="w-[500px] !bg-red-700 relative overflow-hidden rounded-lg">
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/assets/cmusantacruz/book_photos/${book.photo}`}
            alt={book.photo}
            width={700}
            height={700}
          />
        </div>
        <div className='pl-10'>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-2xl text-muted-foreground mb-4">{book.author}</h2>
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
              <h3 className="font-semibold"><span className='text-muted-foreground'>Año de publicación:</span> {book.publishedAt}</h3>
              <h3 className="font-semibold"><span className='text-muted-foreground'>Género:</span> {book.genre}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h3 className="font-semibold"><span className='text-muted-foreground'>Estante:</span> {book.location}</h3>
              <h3 className="font-semibold"><span className='text-muted-foreground'>Editorial:</span> {book.publisher}</h3>
            </div>
            { book.observations && (
              <h3 className="font-semibold"><span className='text-muted-foreground'>Observaciones:</span> {book.observations}</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}