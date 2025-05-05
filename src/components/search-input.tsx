import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SearchInput = () => {
  return (
    <div className="relative">
      <Input 
        className="p-4 rounded-full h-15 flex items-center"
        type="text"
        placeholder="Search specialist by name, city, specialty or phone number"  
      />
      <Button className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center justify-center pr-3 bg-primary text-white shadow-md rounded-full w-10 h-10 cursor-pointer">
        <Search className="text-white" />
      </Button>
    </div>
  );
};

export default SearchInput;
