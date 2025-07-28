"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchProducts } from "@/hooks/useProducts";
import type { ProductsResponse } from "@/types/product";

interface ProductSearchProps {
  onResults: (results: ProductsResponse) => void;
  onClear: () => void;
}

export function ProductSearch({ onResults, onClear }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: searchResults, isLoading } = useSearchProducts(debouncedQuery);

  useEffect(() => {
    if (debouncedQuery && searchResults) {
      onResults(searchResults);
    } else if (!debouncedQuery) {
      onClear();
    }
  }, [debouncedQuery, searchResults, onResults, onClear]);

  const handleClear = () => {
    setSearchQuery("");
    onClear();
  };

  return (
    <div className="relative flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products by title or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isLoading && debouncedQuery && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      )}
    </div>
  );
}
