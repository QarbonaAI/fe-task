"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { useSortingStore } from "@/store/sorting";

export function SortingIndicator() {
  const { sorting, resetSorting } = useSortingStore();
  const { sortBy, sortDirection } = sorting;

  if (!sortBy || !sortDirection) {
    return null;
  }

  const getSortLabel = (column: string) => {
    const labels: Record<string, string> = {
      id: "ID",
      title: "Title",
      brand: "Brand",
      category: "Category",
      price: "Price",
      discountPercentage: "Discount",
      rating: "Rating",
      stock: "Stock",
    };
    return labels[column] || column;
  };

  const getSortIcon = (direction: string) => {
    return direction === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sorted by:</span>
      <Badge variant="secondary" className="gap-1">
        {getSortLabel(sortBy)} {getSortIcon(sortDirection)}
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 ml-1 hover:bg-transparent"
          onClick={resetSorting}
          title="Clear sorting"
        >
          <X className="h-3 w-3" />
        </Button>
      </Badge>
    </div>
  );
} 