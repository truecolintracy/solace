"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Advocate } from "@/types/advocates";
import Header from "@/components/header";
import SearchInput from "@/components/search-input";
import ResultsTable from "@/components/results-table";
import PaginationResults from "@/components/pagination";

const Home = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [resultsPerPage, setResultsPerPage] = useState(1);
  const [totalAdvocates, setTotalAdvocates] = useState(1);
  const searchParams = useSearchParams();
  const currentPage = searchParams.get('page') || '1';
  const currentQuery = searchParams.get('q') || '';

  const updateAdvocates = async (advocateResults: Advocate[]) => {
    setAdvocates(advocateResults);
  };

  const updateTotalResults = async (total: number) => {
    setTotalAdvocates(total);
  };

  const updateResultsPerPage = async (resultsPerPage: number) => {
    setResultsPerPage(resultsPerPage);
  };

  const fetchAdvocates = useCallback(async () => {
    try {
      const params = new URLSearchParams(searchParams.toString());
      const pageSize = params.get('pageSize') || resultsPerPage.toString();
      params.set('pageSize', pageSize);
      params.set('page', currentPage);
      
      if (currentQuery) {
        params.set('q', currentQuery);
      }
      
      const response = await fetch(`/api/advocates?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch advocates");
      }
      const data = await response.json();

      setAdvocates(data.data);
      setTotalAdvocates(data.total);
      setResultsPerPage(data.pageSize);
    } catch (error) {
      console.error("Error fetching advocates:", error);
      setAdvocates([]);
    }
  }, [currentPage, currentQuery, searchParams, resultsPerPage]);

  useEffect(() => {
    fetchAdvocates();
  }, [fetchAdvocates]);

  return (
    <main className="m-5">
      <Header />
      <div className="max-w-7xl m-auto">
        <SearchInput
          updateAdvocates={updateAdvocates}
          updateTotalResults={updateTotalResults}
          updateResultsPerPage={updateResultsPerPage}
          numberResultsPerPage={resultsPerPage}
        />
      </div>
      <div className="max-w-7xl mx-auto my-10">
        <ResultsTable advocates={advocates} />
      </div>
      <div>
        <PaginationResults resultsLength={totalAdvocates} perPageResults={resultsPerPage} />
      </div>
    </main>
  );
}

export default Home;