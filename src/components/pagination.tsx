"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationResults = ({ resultsLength, perPageResults }: { resultsLength: number; perPageResults: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const totalPages = Math.ceil(resultsLength / perPageResults);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    
    if (!params.has('pageSize')) {
      params.set('pageSize', perPageResults.toString());
    }
    router.push(`?${params.toString()}`);
  };
  
  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 ? (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          </PaginationItem>
        ) : null}

        <PaginationItem className={`cursor-pointer ${currentPage === 1 ? 'bg-primary text-white rounded-md' : ''}`}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
        {Array.from({ length: totalPages - 1 }, (_, i) => (
          <PaginationItem key={i + 2} className={`cursor-pointer ${currentPage === i + 2 ? 'bg-primary text-white rounded-md' : ''}`}>
            <PaginationLink onClick={() => handlePageChange(i + 2)}>{i + 2}</PaginationLink>
          </PaginationItem>
        ))}
        {totalPages > 1 && currentPage !== totalPages ? (
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationResults;