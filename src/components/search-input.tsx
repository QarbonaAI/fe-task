"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchInput({ placeholder = "Search products...", onSearch, className }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const onSearchRef = useRef(onSearch);

  // Update ref when onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearchRef.current(debouncedQuery);
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 