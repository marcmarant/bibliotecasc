import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>
}

export const Pagination = ({ currentPage, totalPages, basePath, queryParams = {} }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const createPageLink = (page: number) => {
    const params = new URLSearchParams({ ...queryParams, page: page.toString() });
    return `${basePath}&${params.toString()}`;
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-6">
      {currentPage > 1 && (
        <Link
          href={createPageLink(currentPage - 1)}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          «
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageLink(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={createPageLink(currentPage + 1)}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          »
        </Link>
      )}
    </div>
  );
}
