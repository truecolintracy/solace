import {
  Table,
  TableBody,
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
    <div>
      <div className="md:block hidden">
        <Table data-testid="advocate-table">
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