'use client'

import { SearchBar } from '@/components/SearchBar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 flex flex-col items-center gap-3">
        <div className="relative w-32 h-32 md:w-60 md:h-60 mb-4">
          <Image alt="logo" src="/images/logo.png" fill className="object-contain" priority />
        </div>
        <h1 className="text-xl md:text-3xl font-semibold text-center mb-8">Biblioteca CMU Santa Cruz <br /> Sede Cardenal Mendoza</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  )
}
