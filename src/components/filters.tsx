"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { advocateData } from "@/db/seed/advocates";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Advocate } from "@/types/advocates";
import Filter from "@/components/filter";
import { Button } from "@/components/ui/button";
const getAdvocateData = (filterType: string) => {
  const values = new Set<string>();
  advocateData.forEach((advocate: Advocate) => {
    if (advocate[filterType]) {
      values.add(advocate[filterType]);
    }
  });
  return Array.from(values);
}

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Collapsible className="max-w-7xl mx-auto my-5 border-1 rounded-xl border-gray-300 p-4 cursor-pointer">
      <CollapsibleTrigger className="text-md w-full flex items-center gap-2 justify-between">
        <span className="text-gray-700">
          Filters
        </span>
        <span>
          <ChevronsUpDown className="h-4 w-4" />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
      <div className="max-w-7xl mx-auto my-10 flex flex-col md:flex-row gap-4 justify-evenly-between">
        <Filter config={{
          title: "Min. Years of Experience",
          field: "yearsOfExperience",
          operator: "gte",
          options: [
            { label: "1 year", value: 1 },
            { label: "2 years", value: 2 },
            { label: "3 years", value: 3 },
            { label: "4 years", value: 4 },
            { label: "5 years", value: 5 },
          ]
        }} />
        <Filter config={{
          title: "City",
          field: "city",
          operator: "eq",
          options: (getAdvocateData("city") as string[]).map((city: string) => ({ label: city, value: city })) || [] as { label: string; value: string; }[]
        }} />
        <Filter config={{
          title: "Degree",
          field: "degree",
          operator: "eq",
          options: (getAdvocateData("degree") as string[]).map((degree: string) => ({ label: degree, value: degree })) || [] as { label: string; value: string; }[]
        }} />
      </div>
      <div className="w-full">
        <Button onClick={() => {
          const params = new URLSearchParams(searchParams.toString());
            params.delete('filters');
            router.push(`?${params.toString()}`);
          }}
          className="w-full z-40 cursor-pointer"
          size="lg"
          data-testid="clear-filters"
        >
          Clear Filters
        </Button>
      </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default Filters;