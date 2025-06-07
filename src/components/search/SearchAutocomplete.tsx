
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCardAutocomplete } from "@/hooks/use-scryfall";

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  redirectOnSelect?: boolean;
  initialValue?: string;
}

const SearchAutocomplete = ({ 
  onSearch, 
  placeholder = "Buscar cartas...",
  className = "",
  redirectOnSelect = false,
  initialValue = ""
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMouseOverSuggestions, setIsMouseOverSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);
  
  // Use Scryfall autocomplete for better suggestions
  const { data: suggestions = [] } = useCardAutocomplete(query);

  // Calculate dropdown position when showing suggestions
  useEffect(() => {
    if (showSuggestions && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length >= 2 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setIsMouseOverSuggestions(false);
    onSearch(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleFocus = () => {
    setShowSuggestions(query.length >= 2 && suggestions.length > 0);
  };

  const handleBlur = () => {
    // Only hide suggestions if mouse is not over them
    if (!isMouseOverSuggestions) {
      setShowSuggestions(false);
    }
  };

  const handleMouseEnterSuggestions = () => {
    setIsMouseOverSuggestions(true);
  };

  const handleMouseLeaveSuggestions = () => {
    setIsMouseOverSuggestions(false);
  };

  // Render suggestions dropdown using portal
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return createPortal(
      <div 
        ref={suggestionsRef}
        className="fixed bg-background border rounded-md shadow-lg max-h-80 overflow-auto z-[9999]"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`
        }}
        onMouseEnter={handleMouseEnterSuggestions}
        onMouseLeave={handleMouseLeaveSuggestions}
      >
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            className="w-full px-4 py-3 text-left hover:bg-accent focus:bg-accent focus:outline-none text-sm border-b last:border-b-0"
            onMouseDown={() => handleSuggestionClick(suggestion)}
          >
            <span className="font-medium">{suggestion}</span>
          </button>
        ))}
      </div>,
      document.body
    );
  };

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-10 pr-4 h-11"
        />
      </form>
      
      {renderSuggestions()}
    </div>
  );
};

export default SearchAutocomplete;
