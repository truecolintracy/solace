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
      <Table>
        <TableCaption>No results found</TableCaption>
      </Table>
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
          <TableRow key={advocate.phoneNumber}>
            <TableCell>{advocate.firstName}</TableCell>
            <TableCell>{advocate.lastName}</TableCell>
            <TableCell>{advocate.city}</TableCell>
            <TableCell>{advocate.degree}</TableCell>
            <TableCell className="text-wrap max-w-80 whitespace-normal">
              {Array.isArray(advocate.specialties) ? advocate.specialties.join(", ") : "N/A"}
            </TableCell>
            <TableCell className="text-center">{advocate.yearsOfExperience}</TableCell>
            <TableCell>{advocate.phoneNumber}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;