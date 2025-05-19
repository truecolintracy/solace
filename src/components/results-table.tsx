import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Advocate } from "@/types/advocates";

const ResultsTable = ({ advocates }: { advocates: Advocate[] }) => {
  if (!advocates || advocates.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No results found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Degree</TableHead>
          <TableHead>Specialties</TableHead>
          <TableHead>Years of Experience</TableHead>
          <TableHead>Phone Number</TableHead>
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
  );
};

export default ResultsTable;