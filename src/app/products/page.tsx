"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from "@/api/products.queries";
import type { Product } from "@/api/products";
import ProductForm from "@/components/product-form";
import type { ProductFormValues } from "@/components/product-form";

const PAGE_SIZE = 10;

export default function ProductsPage() {
  useEffect(() => {
    document.title = "All Products – MyShop";
    return () => {
      document.title = "FE task QuarbonaAI";
    };
  }, []);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  const { data, isLoading, isError } = useProducts({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE });
  const products = data?.products || [];
  const total = data?.total || 0;

  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  // Sorting logic (client-side)
  const sortedProducts = useMemo(() => {
    if (!sortField) return products;
    return [...products].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [products, sortField, sortOrder]);

  // Table columns
  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row: any) => row.getValue(),
      sortable: true,
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row: any) => `$${row.getValue()}`,
      sortable: true,
    },
    {
      header: "Rating",
      accessorKey: "rating",
      cell: (row: any) => row.getValue(),
      sortable: true,
    },
    {
      header: "Brand",
      accessorKey: "brand",
      cell: (row: any) => row.getValue(),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row: any) => row.getValue(),
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (row: any) => row.getValue(),
    },
    {
      header: "Actions",
      id: "actions",
      cell: (row: any) => (
        <div className="flex gap-2 !important justify-center !important items-center">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push(`/products/${row.original.id}`)}
          >
            View
          </button>
          <button
            className="text-green-600 hover:underline"
            onClick={e => {
              e.stopPropagation();
              setEditProduct(row.original);
              setShowEdit(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={e => {
              e.stopPropagation();
              setDeleteId(row.original.id);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Handle column header click for sorting
  function handleSort(col: any) {
    if (!col.sortable) return;
    if (sortField === col.accessorKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(col.accessorKey);
      setSortOrder("asc");
    }
  }

  // Pagination controls
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Add product handler
  function handleAddProduct(values: ProductFormValues) {
    addMutation.mutate(values, {
      onSuccess: () => setShowAdd(false),
    });
  }

  // Edit product handler
  function handleEditProduct(values: ProductFormValues) {
    if (!editProduct) return;
    updateMutation.mutate({ id: editProduct.id, data: values }, {
      onSuccess: () => {
        setShowEdit(false);
        setEditProduct(null);
      },
    });
  }

  // Delete product handler
  function handleDeleteProduct() {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded !important cursor-pointer hover:bg-blue-700 transition"
        onClick={() => setShowAdd(true)}
      >
        Add Product
      </button>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-600">Failed to load products.</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <>
          <table className="min-w-full border mb-4">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`p-2 border-b text-center cursor-pointer ${col.sortable ? "hover:bg-gray-500" : ""}`}
                    onClick={() => handleSort(col)}
                  >
                    {col.header}
                    {col.sortable && sortField === col.accessorKey && (
                      <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-500 cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  {columns.map((col) => (
                    <td key={col.header} className="p-2 border-b !important text-center">
                      {col.id === "actions"
                        ? col.cell({ original: product })
                        : col.accessorKey && col.cell({ getValue: () => product[col.accessorKey as keyof Product] })}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 border rounded !important cursor-pointer disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded !important cursor-pointer disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg w-full max-w-lg relative border">
            <button className="absolute top-2 right-2 text-xl hover:text-muted-foreground" onClick={() => setShowAdd(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-3">Add Product</h2>
            {addMutation.isError && (
              <div className="text-destructive mb-2">{(addMutation.error as Error).message}</div>
            )}
            <ProductForm onSubmit={handleAddProduct} loading={addMutation.status === "pending"} />
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {showEdit && editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg w-full max-w-lg relative border">
            <button className="absolute top-2 right-2 text-xl hover:text-muted-foreground" onClick={() => setShowEdit(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-3">Edit Product</h2>
            {updateMutation.isError && (
              <div className="text-destructive mb-2">{(updateMutation.error as Error).message}</div>
            )}
            <ProductForm
              initialValues={editProduct}
              onSubmit={handleEditProduct}
              loading={updateMutation.status === "pending"}
            />
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg w-full max-w-sm relative border">
            <h2 className="text-lg font-bold mb-3">Delete Product</h2>
            <p className="mb-3">Are you sure you want to delete this product?</p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition"
                onClick={handleDeleteProduct}
                disabled={deleteMutation.status === "pending"}
              >
                {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
              </button>
              <button
                className="px-4 py-2 border rounded hover:bg-muted transition"
                onClick={() => setDeleteId(null)}
                disabled={deleteMutation.status === "pending"}
              >
                Cancel
              </button>
            </div>
            {deleteMutation.isError && <div className="text-destructive mt-2">{(deleteMutation.error as Error).message}</div>}
          </div>
        </div>
      )}
    </main>
  );
} 