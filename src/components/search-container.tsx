import { useState } from 'react';
import SearchInput from './search-input';
import ResultsPerPage from './results-per-page';

const SearchContainer = () => {
  const [resultsPerPage, setResultsPerPage] = useState("10");

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      <div className="flex-1">
        <SearchInput />
      </div>
      <ResultsPerPage 
        value={resultsPerPage} 
        onValueChange={setResultsPerPage} 
      />
    </div>
  );
};

export default SearchContainer; 