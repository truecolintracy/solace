"use client";

import { useState, useEffect } from "react";
import { Advocate } from "@/types/advocates";
import Header from "@/components/header";
import SearchInput from "@/components/search-input";
import ResultsTable from "@/components/results-table";


const Home = () => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  const updateAdvocates = async (advocateResults: Advocate[]) => {
    setAdvocates(advocateResults);
  };

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await fetch("/api/advocates");
        
        if (!response.ok) {
          throw new Error("Failed to fetch advocates");
        }
        const data = await response.json();

        setAdvocates(data.data);
      } catch (error) {
        console.error("Error fetching advocates:", error);
        setAdvocates([]);
      }
    };

    fetchAdvocates();
  }, []);

  return (
    <main className="m-5">
      <Header />
      <div className="max-w-7xl m-auto">
        <SearchInput updateAdvocates={updateAdvocates} />
      </div>
      <div className="max-w-7xl mx-auto my-10">
        <ResultsTable advocates={advocates} />
      </div>
    </main>
  );
}

export default Home;