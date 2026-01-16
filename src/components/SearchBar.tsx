import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string, type: 'title' | 'author' | 'general') => void;
  initialQuery?: string;
  initialType?: 'title' | 'author' | 'general';
}

export const SearchBar = ({ onSearch, initialQuery = '', initialType = 'general' }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<'title' | 'author' | 'general'>(initialType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query, type);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 cursor-pointer"
          >
            <option value="general">Todo</option>
            <option value="title">Título</option>
            <option value="author">Autor</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="relative flex-1 flex items-center">
          <Input
            type="text"
            placeholder="Busca un libro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10 w-full"
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-0"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};