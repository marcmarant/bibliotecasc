'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { SearchBar } from '@/components/SearchBar';
import { BookGrid } from '@/components/BookGrid';
import { Pagination } from '@/components/ui/pagination';
import { Book } from '@prisma/client';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const type = (searchParams.get('type') as 'title' | 'author' | 'general') || 'general';
  const page = searchParams.get('page') || '1';
  const [searchResults, setSearchResults] = useState<Book[] | []>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl = window.location.origin;
      const res = await fetch(`${baseUrl}/api/book/search?q=${query}&type=${type}&page=${page}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      setSearchResults(data.books);
      setTotalPages(parseInt(data.totalPages, 10));
    };
    fetchBook();
  }, [query, type, page, router])

  const handleSearch = (newQuery: string, newType: 'title' | 'author' | 'general') => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}&type=${newType}`);
  }

  return (<>
    <NavBar>
      <SearchBar onSearch={handleSearch} initialQuery={query} initialType={type} />
    </NavBar>
    <div className="py-8 md:py-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="mt-4 md:mt-8">
          {searchResults.length > 0 ? (
            <BookGrid books={searchResults} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p className="text-lg">No se encontraron libros.</p>
              <p className="text-sm">Intenta buscar con otros términos.</p>
            </div>
          )}
        </div>
        <div className="pb-8">
          <Pagination
            currentPage={parseInt(page, 10)}
            totalPages={totalPages}
            basePath={`/search?q=${encodeURIComponent(query)}&type=${type}`}
          />
        </div>
      </div>
    </div>
  </>)
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Estamos buscando en el marquesado...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
