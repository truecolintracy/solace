"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Advocate } from '@/types/advocates';
import ResultsPerPage from '@/components/results-per-page';

const SearchInput = (
  { 
    updateAdvocates,
    updateTotalResults,
    updateResultsPerPage,
    numberResultsPerPage = 1,
  }: {
    updateAdvocates: (advocates: Advocate[]) => void;
    updateTotalResults: (total: number) => void;
    updateResultsPerPage: (resultsPerPage: number) => void;
    numberResultsPerPage: number;
  }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resultsPerPage, setResultsPerPage] = useState(numberResultsPerPage);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsSearchLoading(true);
      
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      params.set('pageSize', resultsPerPage.toString());
      params.set('page', '1');
      
      const response = await fetch(`/api/advocates?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advocates');
      }
      
      const data = await response.json();
      updateTotalResults(data.total);
      updateAdvocates(data.data);
      updateResultsPerPage(data.pageSize);
      
      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error('Error searching advocates:', error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-evenly items-center gap-5">
      <div className="relative w-full">
        <Input 
          className="p-4 rounded-full h-15 flex items-center"
          type="text"
          placeholder="Search specialist by name, city, specialty or phone number"
          onKeyDown={handleKeyDown}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center justify-center pr-3 bg-primary text-white shadow-md rounded-full w-10 h-10 cursor-pointer"
          onClick={handleSearch}
          disabled={isSearchLoading}
        >
          <Search className={`text-white ${isSearchLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="relative">
        <ResultsPerPage value={resultsPerPage} onValueChange={setResultsPerPage} />
      </div>
    </div>
  );
};

export default SearchInput;
