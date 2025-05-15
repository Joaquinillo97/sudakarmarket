
import { useState, useEffect } from "react";
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  // Only fetch suggestions if we have at least 2 characters
  const { data: suggestionsData, isLoading } = useCardAutocomplete(searchQuery);
  
  // Make sure suggestions is always a properly initialized array
  const suggestions = Array.isArray(suggestionsData) ? suggestionsData : [];
  
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
    
    // Reset the input and close the suggestions
    setSearchQuery("");
    setOpen(false);
  };
  
  // Control the open state based on input length
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchQuery]);

  return (
    <div className={`relative ${className}`}>
      <Command className="border rounded-md overflow-hidden">
        <CommandInput
          placeholder={placeholder}
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="focus:outline-none"
        />
      </Command>
      
      {open && (
        <div className="absolute w-full z-50 bg-background border rounded-md mt-1 overflow-hidden shadow-md">
          <Command>
            {isLoading && (
              <div className="p-2 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {!isLoading && suggestions.length === 0 && (
              <CommandEmpty className="py-2 px-2 text-sm text-muted-foreground">
                No se encontraron cartas con ese nombre
              </CommandEmpty>
            )}
            
            {!isLoading && suggestions.length > 0 && (
              <CommandGroup className="max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSelectCard(suggestion)}
                    className="cursor-pointer"
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
