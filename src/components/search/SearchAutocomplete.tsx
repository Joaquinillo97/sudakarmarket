
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCardAutocomplete } from "@/hooks/use-scryfall";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Only fetch suggestions if we have at least 2 characters
  const { data: suggestionsData, isLoading } = useCardAutocomplete(searchQuery);
  
  // Make sure suggestions is always an initialized array
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
    setIsDropdownOpen(false);
  };

  // Control the open state based on input length
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cards?name=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery.trim());
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-9 pr-4 w-full focus-visible:ring-mtg-orange"
          />
        </div>
      </form>
      
      {/* Dropdown for suggestions */}
      {isDropdownOpen && suggestions && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-[300px] overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-3 px-2 text-sm text-muted-foreground">
              No se encontraron cartas con ese nombre
            </div>
          ) : (
            <div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSelectCard(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-accent text-sm cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
