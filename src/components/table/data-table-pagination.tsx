import * as React from "react";
import { type Table } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  // Logic to get an array of up to 3 page numbers to display
  const pagesToShow = React.useMemo(() => {
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
    const currentPage = pageIndex + 1;

    // If there are 3 or fewer total pages, show all of them
    if (pageCount <= 3) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    // If on the first page, show pages 1, 2, 3
    if (currentPage === 1) {
      return [1, 2, 3];
    }

    // If on the last page, show the last three pages
    if (currentPage === pageCount) {
      return [pageCount - 2, pageCount - 1, pageCount];
    }

    // Otherwise, show the current page and its immediate neighbors
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [table.getState().pagination.pageIndex, table.getPageCount()]);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {pagesToShow.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={table.getState().pagination.pageIndex === page - 1}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}