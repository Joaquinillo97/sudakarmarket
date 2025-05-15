
import { useState } from "react";
import { useCardAutocomplete } from "@/hooks/use-scryfall";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  redirectOnSelect?: boolean;
}

const SearchAutocomplete = ({
  placeholder = "Buscar cartas...",
  className = "",
  onSearch,
  redirectOnSelect = true
}: SearchAutocompleteProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Fetch suggestions from Scryfall API
  const { data: suggestionsData, isLoading } = useCardAutocomplete(searchQuery);
  
  // Ensure we have a valid array of suggestions
  const suggestions = suggestionsData || [];
  
  // Handle item selection
  const handleSelectCard = (cardName: string) => {
    if (redirectOnSelect) {
      // Simulate card not found/no sellers have this card
      toast.info(`Nadie tiene "${cardName}" disponible`, {
        description: "Puedes agregarla a tu wishlist o buscar otra carta",
      });
      
      // Navigate to search results with this card name
      navigate(`/cards?name=${encodeURIComponent(cardName)}`);
    }
    
    // Call custom search handler if provided
    if (onSearch) {
      onSearch(cardName);
    }
    
    // Reset the input
    setSearchQuery("");
  };
  
  return (
    <Command className={`border rounded-md overflow-hidden ${className}`}>
      <CommandInput
        placeholder={placeholder}
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="focus:outline-none"
      />
      
      {searchQuery.length >= 2 && (
        <>
          {isLoading && (
            <div className="p-2 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {!isLoading && (
            <>
              <CommandEmpty className="py-2 px-2 text-sm text-muted-foreground">
                No se encontraron cartas con ese nombre
              </CommandEmpty>
              
              {suggestions && suggestions.length > 0 && (
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={handleSelectCard}
                      className="cursor-pointer"
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </>
      )}
    </Command>
  );
};

export default SearchAutocomplete;
