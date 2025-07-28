"use client";

import { type Table } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize?: number;
  setPageSize?: (size: number) => void;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
}: DataTablePaginationProps<TData>) {
  const [pageInput, setPageInput] = useState<string>("");
  const [isFirstPopoverOpen, setFirstPopoverOpen] = useState(false);
  const [isSecondPopoverOpen, setSecondPopoverOpen] = useState(false);
  const [secondPageInput, setSecondPageInput] = useState<string>("");

  const handleSetPage = () => {
    const targetPage = Number(pageInput) - 1;
    if (targetPage >= 0 && targetPage < table.getPageCount()) {
      setPageIndex?.(targetPage);
    }
    setPageInput("");
    setFirstPopoverOpen(false);
  };

  const handleSecondSetPage = () => {
    const targetPage = Number(secondPageInput) - 1;
    if (targetPage >= 0 && targetPage < table.getPageCount()) {
      setPageIndex?.(targetPage);
    }
    setSecondPageInput("");
    setSecondPopoverOpen(false);
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${pageSize ?? table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            const size = Number(value);
            table.setPageSize(size);
            setPageSize?.(size);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
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
                onClick={() => setPageIndex?.((pageIndex ?? 0) - 1)}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>

            {/* First page */}
            {table.getPageCount() > 0 && (
              <PaginationItem>
                <PaginationLink
                  isActive={pageIndex === 0}
                  onClick={() => setPageIndex?.(0)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* First ellipsis */}
            {(pageIndex ?? 0) > 2 && (
              <PaginationItem>
                <Popover
                  open={isFirstPopoverOpen}
                  onOpenChange={setFirstPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-9 cursor-pointer p-0"
                    >
                      <PaginationEllipsis />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Page"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        className="h-8"
                      />
                      <Button size="sm" className="h-8" onClick={handleSetPage}>
                        Go
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </PaginationItem>
            )}

            {/* Current page range */}
            {table.getPageCount() > 1 &&
              Array.from({
                length: Math.min(3, table.getPageCount() - 2),
              }).map((_, i) => {
                const currentIndex = pageIndex ?? 0;
                let page;
                if (currentIndex <= 2) {
                  page = i + 1;
                } else if (currentIndex >= table.getPageCount() - 3) {
                  page = table.getPageCount() - 3 + i;
                } else {
                  page = currentIndex - 1 + i;
                }

                if (page === 0 || page === table.getPageCount() - 1)
                  return null;

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentIndex === page}
                      onClick={() => setPageIndex?.(page)}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            {/* Second ellipsis */}
            {(pageIndex ?? 0) < table.getPageCount() - 3 && (
              <PaginationItem>
                <Popover
                  open={isSecondPopoverOpen}
                  onOpenChange={setSecondPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 w-9 cursor-pointer p-0"
                    >
                      <PaginationEllipsis />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 p-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Page"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSecondSetPage();
                          }
                        }}
                        value={secondPageInput}
                        onChange={(e) => setSecondPageInput(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={handleSecondSetPage}
                      >
                        Go
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </PaginationItem>
            )}

            {/* Last page */}
            {table.getPageCount() > 1 && (
              <PaginationItem>
                <PaginationLink
                  isActive={pageIndex === table.getPageCount() - 1}
                  onClick={() => setPageIndex?.(table.getPageCount() - 1)}
                >
                  {table.getPageCount()}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPageIndex?.((pageIndex ?? 0) + 1)}
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
