"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ResultsPerPageProps = {
  value: number;
  onValueChange: (value: number) => void;
}

const ResultsPerPage = ({ value, onValueChange }: ResultsPerPageProps) => {
  const handleValueChange = (val: string) => {
    onValueChange(Number(val));
  }

  return (
    <Select value={value.toString()} onValueChange={handleValueChange} >
      <SelectTrigger className="w-auto rounded-full p-4 min-h-15 min-w-40 flex items-center">
        <SelectValue placeholder="Results per page" />
      </SelectTrigger>
      <SelectContent className="text-center">
        <SelectItem className="text-center" value="1">1 per page</SelectItem>
        <SelectItem className="text-center" value="5">5 per page</SelectItem>
        <SelectItem className="text-center" value="10">10 per page</SelectItem>
        <SelectItem className="text-center" value="20">20 per page</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ResultsPerPage; 