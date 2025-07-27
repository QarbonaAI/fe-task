"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/table/data-table";
import { productColumns } from "@/components/table/product-columns";
import { AddProductDialog } from "@/components/forms/product-dialog";
import { usePaginationStore } from "@/store/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductsList } from "@/hooks/useProductList";

export default function ProductsPage() {
  const { pagination, setPage, setPerPage, setTotalNext } = usePaginationStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useProductsList(pageSize, currentPage * pageSize);

  useEffect(() => {
    if (data) {
      setTotalNext(data.total > (currentPage + 1) * pageSize, data.total);
    }
  }, [data, currentPage, pageSize, setTotalNext]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPerPage(newPageSize);
    setCurrentPage(0);
    setPage(0);
  };

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error loading products</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <AddProductDialog />
      </div>

      <div className="space-y-4">
        <DataTable
          columns={productColumns}
          data={data?.products || []}
        />

        {/* Custom Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700">
              Showing {currentPage * pageSize + 1} to{" "}
              {Math.min((currentPage + 1) * pageSize, data?.total || 0)} of{" "}
              {data?.total || 0} results
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.ceil((data?.total || 0) / pageSize) }, (_, i) => {
                const page = i + 1;
                const isCurrentPage = i === currentPage;
                const isNearCurrent = Math.abs(i - currentPage) <= 2;

                if (isCurrentPage || isNearCurrent || i === 0 || i === Math.ceil((data?.total || 0) / pageSize) - 1) {
                  return (
                    <Button
                      key={i}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className="w-8 h-8"
                    >
                      {page}
                    </Button>
                  );
                } else if (isNearCurrent) {
                  return <span key={i}>...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data || (currentPage + 1) * pageSize >= data.total}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 