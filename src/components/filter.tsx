"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  label: string;
  value: string | number;
};

type FilterConfig = {
  title: string;
  field: string;
  operator: 'gte' | 'lte' | 'eq' | 'like';
  options: FilterOption[];
};

type FilterProps = {
  config: FilterConfig;
};

const Filter = ({ config }: FilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Parse existing filters from URL
  const getCurrentFilters = () => {
    const filtersParam = searchParams.get('filters');
    if (!filtersParam) return [];
    try {
      return JSON.parse(filtersParam);
    } catch {
      return [];
    }
  };

  // Get current value for this filter
  const getCurrentValue = () => {
    const filters = getCurrentFilters();
    const currentFilter = filters.find(f => f.field === config.field);
    return currentFilter?.value?.toString() || '';
  };

  const handleValueChange = (newValue: string) => {
    const filters = getCurrentFilters();
    
    // Remove existing filter for this field if it exists
    const filteredFilters = filters.filter(f => f.field !== config.field);
    
    // Add new filter if a value is selected
    if (newValue) {
      filteredFilters.push({
        field: config.field,
        operator: config.operator,
        value: newValue
      });
    }

    // Update URL with new filters
    const params = new URLSearchParams(searchParams.toString());
    if (filteredFilters.length > 0) {
      params.set('filters', JSON.stringify(filteredFilters));
    } else {
      params.delete('filters');
    }
    
    // Reset to page 1 when filter changes
    params.set('page', '1');
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{config.title}</label>
      <Select 
        value={getCurrentValue()} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-full md:w-auto rounded-full p-4 min-h-15 min-w-40 flex items-center">
          <SelectValue placeholder={`Select ${config.title.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="text-center">
          {config.options.map((option) => (
            <SelectItem 
              key={option.value.toString()} 
              value={option.value.toString()}
              className="text-center"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;