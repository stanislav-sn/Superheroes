import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number | 'all';
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number | 'all') => void;
  total: number;
}

const limitOptions = [
  { value: '5', label: '5 per page' },
  { value: '16', label: '16 per page' },
  { value: 'all', label: 'Show all' },
];

export function Pagination({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
  total,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (limit === 'all') {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Showing all {total} superheroes</div>
        <Select
          value={String(limit)}
          onValueChange={(value: string) => onLimitChange(value === 'all' ? 'all' : Number(value))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * Number(limit) + 1} to{' '}
        {Math.min(currentPage * Number(limit), total)} of {total} superheroes
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={String(limit)}
          onValueChange={(value: string) => onLimitChange(value === 'all' ? 'all' : Number(value))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ShadPagination className="sm:ml-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {getVisiblePages().map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(page as number);
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage < totalPages) onPageChange(currentPage + 1);
                }}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadPagination>
      </div>
    </div>
  );
}
