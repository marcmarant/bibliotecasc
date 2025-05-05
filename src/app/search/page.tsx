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
  const page = searchParams.get('page') || '1';
  const [searchResults, setSearchResults] = useState<Book[] | []>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchBook = async () => {
      const res = await fetch(`http://localhost:3000/api/book/search?title=${query}&page=${page}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      setSearchResults(data.books);
      setTotalPages(parseInt(data.totalPages, 10));
    };
    fetchBook();
  }, [query, page, router])

  const handleSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  }

  return (<>
    <NavBar>
      <SearchBar onSearch={handleSearch} />
    </NavBar>
    <div className="py-20 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="mt-8">
          {searchResults.length > 0 ? (
            <BookGrid books={searchResults} />
          ) : (
            <p className="text-center text-muted-foreground">No se encontraron libros. Intenta con otra búsqueda.</p>
          )}
        </div>
        <Pagination
          currentPage={parseInt(page, 10)}
          totalPages={totalPages}
          basePath={`/search?q=${encodeURIComponent(query)}`}
        />
      </div>
    </div>
  </>)
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div>Estamos buscando en el marquesado...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
