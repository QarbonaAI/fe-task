"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import type { Product, ProductsResponse } from "@/hooks/useProductsQuery";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { DataTable } from "@/components/table/data-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";
import { ProductForm } from "@/components/product-form";
import type { ProductFormValues } from "@/components/product-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Star, Package, TrendingUp, Users } from "lucide-react";

export default function ClientProductsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Determine sortBy and sortOrder for the API
  const sortBy = sorting[0]?.id;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading, isError } = useProductsQuery({
    page,
    pageSize,
    sortBy,
    sortOrder,
  });

  // Handlers for row actions
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };
  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
    setShowDeleteModal(true);
  };
  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  // Add Product handler
  const handleAddProduct = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      const { data: newProduct } = await axios.post("https://dummyjson.com/products/add", values);
      setShowAddModal(false);
      
      // Update cache for the current page
      const currentQueryKey = ["products", page, pageSize, sortBy, sortOrder];
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: currentQueryKey },
        (old) => {
          if (!old) return old;
          // Add to current page if it's the first page, otherwise just update total
          if (page === 0) {
            return {
              ...old,
              products: [
                { ...newProduct, id: Date.now() },
                ...old.products.slice(0, old.products.length - 1),
              ],
              total: old.total + 1,
            };
          }
          return {
            ...old,
            total: old.total + 1,
          };
        }
      );
    } catch (e) {
      alert("Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Product handler
  const handleUpdateProduct = async (values: ProductFormValues) => {
    if (!editProduct) return;
    setIsSubmitting(true);
    try {
      await axios.put(`https://dummyjson.com/products/${editProduct.id}`, values);
      setShowEditModal(false);
      setEditProduct(null);
      
      // Update cache for the current page
      const currentQueryKey = ["products", page, pageSize, sortBy, sortOrder];
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: currentQueryKey },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.map((p) =>
              p.id === editProduct.id ? { ...p, ...values } : p
            ),
          };
        }
      );
    } catch (e) {
      alert("Failed to update product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product handler
  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    setIsSubmitting(true);
    try {
      await axios.delete(`https://dummyjson.com/products/${deleteProduct.id}`);
      setShowDeleteModal(false);
      setDeleteProduct(null);
      
      // Update cache for the current page
      const currentQueryKey = ["products", page, pageSize, sortBy, sortOrder];
      queryClient.setQueriesData<ProductsResponse>(
        { queryKey: currentQueryKey },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.filter((p) => p.id !== deleteProduct.id),
            total: old.total - 1,
          };
        }
      );
    } catch (e) {
      alert("Failed to delete product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define columns for the DataTable
  const columns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        accessorKey: "thumbnail",
        header: "Product",
        cell: (info) => (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
              <img 
                src={info.getValue()} 
                alt="Product thumbnail" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21,15 16,10 5,21'/%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                {info.row.original.brand}
              </div>
            </div>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <div 
            className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200 truncate"
            onClick={() => handleView(info.row.original)}
          >
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: (info) => (
          <div className="font-semibold text-slate-900 dark:text-white">
            ${info.getValue().toFixed(2)}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        cell: (info) => (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(info.getValue())
                      ? "text-yellow-400 fill-current"
                      : i < info.getValue()
                      ? "text-yellow-400"
                      : "text-slate-300 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
              {info.getValue().toFixed(1)}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              info.getValue() > 10 
                ? "bg-green-500" 
                : info.getValue() > 0 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }`} />
            <span className={`font-medium ${
              info.getValue() > 10 
                ? "text-green-700 dark:text-green-400" 
                : info.getValue() > 0 
                ? "text-yellow-700 dark:text-yellow-400" 
                : "text-red-700 dark:text-red-400"
            }`}>
              {info.getValue()}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row.original}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ),
      },
    ],
    []
  );

  const totalProducts = data ? (data as unknown as ProductsResponse).total : 0;
  const currentProducts = data ? (data as unknown as ProductsResponse).products.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                Manage your product catalog with advanced features and analytics
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold flex items-center gap-3 group"
              onClick={() => setShowAddModal(true)}
            >
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              Add New Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Current Page</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{currentProducts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Page Size</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{pageSize}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Current Page</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{page + 1}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Loading products...</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Please wait while we fetch your data</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Error loading products</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">We encountered an issue while fetching your products. Please try again later.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          {data && (
            <>
              <div className="p-6">
                <DataTable
                  columns={columns}
                  data={((data as unknown) as ProductsResponse).products}
                  sorting={sorting}
                  onSortingChange={setSorting}
                  showPagination={false}
                />
              </div>

              {/* Enhanced Pagination */}
              <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Showing <span className="font-semibold text-slate-900 dark:text-white">{page * pageSize + 1}</span> to{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {Math.min((page + 1) * pageSize, totalProducts)}
                    </span>{" "}
                    of <span className="font-semibold text-slate-900 dark:text-white">{totalProducts}</span> products
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-xl px-4 py-2 border border-slate-300 dark:border-slate-600">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">Page</span>
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg font-semibold text-sm">
                        {page + 1}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-sm">
                        of {Math.ceil(totalProducts / pageSize)}
                      </span>
                    </div>

                    <button
                      className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={data && (page + 1) * pageSize >= totalProducts}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Product</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Create a new product for your catalog</p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 flex items-center justify-center"
                    onClick={() => setShowAddModal(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ProductForm onSubmit={handleAddProduct} submitLabel={isSubmitting ? "Adding Product..." : "Add Product"} />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Edit Product Modal */}
        {showEditModal && editProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Product</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Update product information</p>
                  </div>
                  <button
                    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 flex items-center justify-center"
                    onClick={() => { setShowEditModal(false); setEditProduct(null); }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <ProductForm
                  initialValues={editProduct}
                  onSubmit={handleUpdateProduct}
                  submitLabel={isSubmitting ? "Saving Changes..." : "Save Changes"}
                />
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Delete Confirmation Modal */}
        {showDeleteModal && deleteProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md relative border border-slate-200 dark:border-slate-700">
              <div className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Delete Product</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteProduct.title}</strong>? 
                    This action cannot be undone and will permanently remove the product from your catalog.
                  </p>

                  <div className="flex gap-4">
                    <button
                      className="flex-1 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-200 font-medium"
                      onClick={() => { setShowDeleteModal(false); setDeleteProduct(null); }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                      onClick={handleConfirmDelete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Deleting...
                        </div>
                      ) : (
                        "Delete Product"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 