"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePaginationStore } from "@/store/pagination";
import { PageSizeSelector } from "./page-size-selector";

export function PaginationControls() {
  const { pagination, setPage } = usePaginationStore();
  const { pageIndex, pageSize, has_next, total_count } = pagination;

  const totalPages = Math.ceil(total_count / pageSize);
  const currentPage = pageIndex + 1; // Convert to 1-based for display

  const handlePrevious = () => {
    if (pageIndex > 0) {
      setPage(pageIndex - 1);
    }
  };

  const handleNext = () => {
    if (has_next) {
      setPage(pageIndex + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-2 flex-col md:flex-row gap-2">
      <div className="flex items-center space-x-2">
        <PageSizeSelector />
        <div className="text-sm text-muted-foreground">
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, total_count)} of {total_count} results
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!has_next}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 