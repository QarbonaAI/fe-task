"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePaginationStore } from "@/store/pagination";
import { useQueryClient } from "@tanstack/react-query";

const pageSizeOptions = [10, 20, 50, 100];

export function PageSizeSelector() {
  const { pagination, setPerPage } = usePaginationStore();
  const { pageSize } = pagination;
  const queryClient = useQueryClient();

  const handlePageSizeChange = (newPageSize: number) => {
    // Clear accumulated cache when page size changes
    queryClient.removeQueries({
      queryKey: ["products-accumulated"],
    });
    
    setPerPage(newPageSize);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {pageSize} per page
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {pageSizeOptions.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => handlePageSizeChange(size)}
            className={pageSize === size ? "bg-accent" : ""}
          >
            {size} per page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 