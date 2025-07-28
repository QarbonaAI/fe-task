"use client"

import { Filter } from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { type Table } from "@tanstack/react-table"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    const column = table.getColumn(columnId);
    if (column) {
      column.toggleSorting(direction === 'desc');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Filter />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Title sorting */}
        <DropdownMenuItem onClick={() => handleSort('title', 'asc')}>
          Title (A-Z)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('title', 'desc')}>
          Title (Z-A)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Price sorting */}
        <DropdownMenuItem onClick={() => handleSort('price', 'asc')}>
          Price (Low to High)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('price', 'desc')}>
          Price (High to Low)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Rating sorting */}
        <DropdownMenuItem onClick={() => handleSort('rating', 'asc')}>
          Rating (Low to High)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('rating', 'desc')}>
          Rating (High to Low)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
