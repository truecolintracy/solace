"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ResultsPerPageProps = {
  value: string;
  onValueChange: (value: string) => void;
}

const ResultsPerPage = ({ value, onValueChange }: ResultsPerPageProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} >
      <SelectTrigger className="w-auto rounded-full p-4 min-h-15 min-w-40 flex items-center">
        <SelectValue placeholder="Results per page" />
      </SelectTrigger>
      <SelectContent className="text-center">
        <SelectItem className="text-center" value="10">10 per page</SelectItem>
        <SelectItem className="text-center" value="20">20 per page</SelectItem>
        <SelectItem className="text-center" value="30">30 per page</SelectItem>
        <SelectItem className="text-center" value="50">50 per page</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ResultsPerPage; 