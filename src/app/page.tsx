"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Advocate } from "@/types/advocates";
import Header from "@/components/header";
import SearchInput from "@/components/search-input";
import ResultsTable from "@/components/results-table";
import PaginationResults from "@/components/pagination";

const Home = () => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  const currentQuery = searchParams.get('q') || '';
  const currentPageSize = searchParams.get('pageSize') || '10';

  const fetchAdvocates = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      params.set('pageSize', currentPageSize);
      params.set('page', currentPage);
      
      if (currentQuery) {
        params.set('q', currentQuery);
      }
      
      const response = await fetch(`/api/advocates?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch advocates");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching advocates:", error);
      return { data: [], total: 0, pageSize: Number(currentPageSize) };
    }
  }, [currentPage, currentQuery, currentPageSize]);

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [totalAdvocates, setTotalAdvocates] = useState(0);

  useEffect(() => {
    const updateResults = async () => {
      const data = await fetchAdvocates();
      setAdvocates(data.data);
      setTotalAdvocates(data.total);
    };
    updateResults();
  }, [fetchAdvocates]);

  return (
    <main className="m-5">
      <Header />
      <div className="max-w-7xl m-auto">
        <SearchInput />
      </div>
      <div className="max-w-7xl mx-auto my-10">
        <ResultsTable advocates={advocates} />
      </div>
      {totalAdvocates > 0 ? (
        <div>
          <PaginationResults resultsLength={totalAdvocates} perPageResults={Number(currentPageSize)} />
        </div>
      ) : null}
    </main>
  );
}

export default Home;