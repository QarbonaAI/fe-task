"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "@/api/index";
import type { Product } from "@/api/index";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import ProductForm from "./product-form";
import { toast } from "react-toastify";
import Head from "next/head";
import Link from "next/link";
import { type PaginationState } from "@tanstack/react-table";
import { cn } from "@/lib/utils"; 

type ProductsQueryData = {
  products: Product[];
  total: number;
};

type ProductInput = Omit<Product, 'id' | 'rating' | 'thumbnail'>;

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pagination]);

  const queryKey = ["products", pagination];

  const { data, isLoading, isFetching, error } = useQuery<ProductsQueryData>({
    queryKey: queryKey,
    queryFn: () => fetchProducts(pagination.pageSize, pagination.pageIndex * pagination.pageSize),
  });

  const totalPages = data ? Math.ceil(data.total / pagination.pageSize) : 0;

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast.success("Product 'added' successfully (client-side)!");
      queryClient.invalidateQueries({ queryKey });
      setOpenForm(false);
    },
    onError: () => toast.error("Failed to add product."),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Product }) => updateProduct(id, input),
    onSuccess: () => {
      toast.success("Product 'updated' successfully (client-side)!");
      queryClient.invalidateQueries({ queryKey });
      setEditProduct(null);
    },
    onError: () => toast.error("Failed to update product."),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      toast.success("Product 'deleted' successfully (client-side)!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error("Failed to delete product."),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products.</div>;

  return (
    <>
      <Head>
        <title>All Products – MyShop</title>
      </Head>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" className="mr-2">&larr; Home</Button>
          </Link>
          <h1 className="text-2xl font-bold">All Products</h1>
        </div>
        <Button onClick={() => setOpenForm(true)}>Add Product</Button>
      </div>

      <div className={cn("relative", isFetching && "opacity-50 pointer-events-none")}>
        <DataTable
          columns={columns({
            onEdit: (product: Product) => setEditProduct(product),
            onDelete: (id: number) => deleteMutation.mutate(id),
          })}
          data={data?.products ?? []}
          pageCount={totalPages}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>
      
      {openForm && (
        <ProductForm
          onSubmit={(values) => addMutation.mutate(values as ProductInput)}
          onClose={() => setOpenForm(false)}
        />
      )}
      {editProduct && (
        <ProductForm
          defaultValues={editProduct}
          onSubmit={(values) => {
            const updatedInput = { ...editProduct, ...values };
            updateMutation.mutate({ id: editProduct.id, input: updatedInput });
          }}
          onClose={() => setEditProduct(null)}
        />
      )}
    </>
  );
}