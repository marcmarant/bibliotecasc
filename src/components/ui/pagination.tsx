import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>
}

type PageItem =
  | { type: 'page'; page: number; key: string; className?: string }
  | { type: 'ellipsis'; key: string; className?: string };

export const Pagination = ({ currentPage, totalPages, basePath, queryParams = {} }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const createPageLink = (page: number) => {
    const params = new URLSearchParams({ ...queryParams, page: page.toString() });
    return `${basePath}&${params.toString()}`;
  };

  const renderPageItems = (): PageItem[] => {
    const items: PageItem[] = [];

    // Always show First Page
    items.push({ type: 'page', page: 1, key: 'first' });

    // Left Logic
    if (currentPage > 4) {
      items.push({ type: 'ellipsis', key: 'left-ellipsis-desktop' });
    } else if (currentPage > 3) {
      items.push({ type: 'ellipsis', key: 'left-ellipsis-mobile', className: 'block md:hidden' });
    }

    if (currentPage > 3) {
      items.push({ type: 'page', page: currentPage - 2, className: 'hidden md:block', key: 'prev-2' });
    }
    if (currentPage > 2) {
      items.push({ type: 'page', page: currentPage - 1, key: 'prev-1' });
    }

    // Current Page (if not first/last)
    if (currentPage !== 1 && currentPage !== totalPages) {
      items.push({ type: 'page', page: currentPage, key: 'current' });
    }

    // Right Logic
    if (currentPage < totalPages - 1) {
      items.push({ type: 'page', page: currentPage + 1, key: 'next-1' });
    }
    if (currentPage < totalPages - 2) {
      items.push({ type: 'page', page: currentPage + 2, className: 'hidden md:block', key: 'next-2' });
    }

    if (currentPage < totalPages - 3) {
      items.push({ type: 'ellipsis', key: 'right-ellipsis-desktop' });
    } else if (currentPage < totalPages - 2) {
      items.push({ type: 'ellipsis', key: 'right-ellipsis-mobile', className: 'block md:hidden' });
    }

    // Always show Last Page
    if (totalPages > 1) {
      items.push({ type: 'page', page: totalPages, key: 'last' });
    }

    return items;
  };

  const items = renderPageItems();

  return (
    <div className="flex justify-center flex-wrap gap-2 mt-6">
      {currentPage > 1 && (
        <Link
          href={createPageLink(currentPage - 1)}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          aria-label="Previous Page"
        >
          «
        </Link>
      )}

      {items.map((item) => {
        if (item.type === 'ellipsis') {
          return (
            <span key={item.key} className={`px-2 py-1 ${item.className || ''}`}>...</span>
          );
        }

        const pageItem = item as Extract<PageItem, { type: 'page' }>;
        const isActive = pageItem.page === currentPage;

        return (
          <Link
            key={pageItem.key}
            href={createPageLink(pageItem.page)}
            className={`px-3 py-1 border rounded ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              } ${pageItem.className || ''}`}
          >
            {pageItem.page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={createPageLink(currentPage + 1)}
          className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          aria-label="Next Page"
        >
          »
        </Link>
      )}
    </div>
  );
}
