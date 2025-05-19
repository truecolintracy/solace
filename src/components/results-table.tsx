"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Advocate } from "@/types/advocates";
import { Sort, SortDirection } from "@/types/sort"
import { ArrowUpWideNarrow } from "lucide-react";

type SortState = {
  sort: Sort | null;
  direction: SortDirection;
}

const ResultsTable = ({ advocates }: { advocates: Advocate[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortState, setSortState] = useState<SortState>({
    sort: null,
    direction: 'asc'
  });

  const handleToggleSort = (sortByName: Sort) => {
    setSortState(prevState => {
      const newDirection = prevState.sort === sortByName 
        ? (prevState.direction === 'asc' ? 'desc' : 'asc')
        : 'asc';

      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', sortByName);
      params.set('sortDirection', newDirection);
      router.push(`?${params.toString()}`);

      return {
        sort: sortByName,
        direction: newDirection
      };
    });
  }

  if (!advocates || advocates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="md:block hidden">
        <Table data-testid="advocate-table">
          <TableHeader>
            <TableRow>
              <TableHead data-testid="sort-by-firstName" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("firstName")}>
                <span className="inline-block">First Name</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "firstName" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-lastName" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("lastName")}>
                <span className="inline-block">Last Name</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "lastName" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-city" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("city")}>
                <span className="inline-block">City</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "city" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-degree" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("degree")}>
                <span className="inline-block">Degree</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "degree" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-specialties" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("specialties")}>
                <span className="inline-block">Specialties</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "specialties" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-yearsOfExperience" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("yearsOfExperience")}>
                <span className="inline-block">Years of Experience</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "yearsOfExperience" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`} />
                </span>
              </TableHead>
              <TableHead data-testid="sort-by-phoneNumber" className="cursor-pointer whitespace-nowrap" onClick={() => handleToggleSort("phoneNumber")}>
                <span>Phone Number</span>
                <span className={`inline-block`}>
                  <ArrowUpWideNarrow className={`${sortState.sort === "phoneNumber" ? (sortState.direction === 'asc' ? 'rotate-180' : '') : ''} transition-all size-5 ml-1 relative top-1`}/>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advocates?.map((advocate) => (
              <TableRow key={advocate.phoneNumber} data-testid="advocate-row">
                <TableCell data-testid="first-name">{advocate.firstName}</TableCell>
                <TableCell data-testid="last-name">{advocate.lastName}</TableCell>
                <TableCell data-testid="city">{advocate.city}</TableCell>
                <TableCell data-testid="degree">{advocate.degree}</TableCell>
                <TableCell className="text-wrap max-w-80 whitespace-normal" data-testid="specialties">
                  {Array.isArray(advocate.specialties) ? advocate.specialties.join(", ") : "N/A"}
                </TableCell>
                <TableCell className="text-center" data-testid="years-of-experience">{advocate.yearsOfExperience}</TableCell>
                <TableCell data-testid="phone-number">{advocate.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-4" data-testid="advocate-mobile-table">
        {advocates?.map((advocate) => (
          <div key={advocate.phoneNumber} className="bg-white rounded-lg shadow-xs border-1 p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">First Name:</div>
              <div data-testid="first-name">{advocate.firstName}</div>
              
              <div className="font-semibold">Last Name:</div>
              <div data-testid="last-name">{advocate.lastName}</div>
              
              <div className="font-semibold">City:</div>
              <div data-testid="city">{advocate.city}</div>
              
              <div className="font-semibold">Degree:</div>
              <div data-testid="degree">{advocate.degree}</div>
              
              <div className="font-semibold">Years of Experience:</div>
              <div data-testid="years-of-experience">{advocate.yearsOfExperience}</div>
              
              <div className="font-semibold">Phone Number:</div>
              <div data-testid="phone-number">{advocate.phoneNumber}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Specialties:</div>
              <div className="text-wrap" data-testid="specialties">
                {Array.isArray(advocate.specialties) ? advocate.specialties.join(", ") : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsTable;