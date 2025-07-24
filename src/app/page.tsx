"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash, Search, X, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch("https://dummyjson.com/products?limit=100");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
};

const skeletonRows = Array.from({ length: 8 });

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}) => {
  // Calculate result range
  const start = totalItems === 0 ? 0 : currentPage * itemsPerPage + 1;
  const end = Math.min((currentPage + 1) * itemsPerPage, totalItems);
  // Smart page range (2 before/after current)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    return range;
  };
  return (
    <div className="flex items-center justify-between w-full flex-wrap gap-2 mt-6">
      {/* Results Counter */}
      <span className="text-sm text-muted-foreground">
        Showing {start} to {end} of {totalItems} results
      </span>
      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "bg-product-primary text-product-primary-foreground hover:bg-product-primary/90"
                : "hover:bg-product-primary hover:text-product-primary-foreground"
            }
          >
            {page + 1}
          </Button>
        ))}
        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || totalPages === 0}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const addProductSchema = z.object({
  title: z.string().min(1, 'Title required').max(100, 'Max 100 chars'),
  description: z.string().min(1, 'Description required').max(500, 'Max 500 chars'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  brand: z.string().min(1, 'Brand required'),
  category: z.string().min(1, 'Category required'),
  thumbnail: z.string().min(1, 'Image required'),
});

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Product | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const addForm = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 0,
      brand: '',
      category: '',
      thumbnail: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        addForm.setValue('thumbnail', ev.target?.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClearImage = () => {
    setImagePreview("");
    addForm.setValue('thumbnail', '', { shouldValidate: true });
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(setProducts)
      .catch((e) => {
        setError(e.message);
        setProducts([]); // always set to array on error
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    let filtered = arr.filter((p) => {
      const q = debouncedSearch.toLowerCase();
      return (
        (p.title ?? "").toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q)
      );
    });
    if (sortField) {
      filtered = filtered.slice().sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, debouncedSearch, sortField, sortOrder]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, itemsPerPage]);

  // Sort handler
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleAddProduct = async (values: z.infer<typeof addProductSchema>) => {
    setAddLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    setProducts((prev) => [
      {
        id: Date.now(),
        discountPercentage: 0,
        rating: 0,
        ...values,
      },
      ...prev,
    ]);
    setAddLoading(false);
    setAddDialogOpen(false);
    addForm.reset();
    setImagePreview("");
  };

  // Responsive: hide brand/rating on small screens
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Search & Add Product Card */}
      <Card className="w-full max-w-6xl mx-auto mt-8 mb-4 p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-xl flex-1">
          <Input
            className="pl-10 pr-10 h-12 text-base shadow-md"
            placeholder="Search products by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>
        {/* Add Product Button (Dialog) */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg rounded-2xl p-0 bg-background dark:bg-[#18181b] shadow-2xl">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="text-2xl font-bold">Add New Product</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details below to add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <Form {...addForm}>
              <form
                onSubmit={addForm.handleSubmit(handleAddProduct)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
              >
                <FormField
                  control={addForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={100} placeholder="Product title" className="focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} maxLength={500} placeholder="Product description" className="focus-visible:ring-primary min-h-[80px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            {...field}
                            type="number"
                            min={0}
                            step={0.01}
                            className="pl-6 focus-visible:ring-primary"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min={0} className="focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brand" className="focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Category" className="focus-visible:ring-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addForm.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Product Image</FormLabel>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                          {imagePreview || field.value ? (
                            <img src={imagePreview || field.value} alt="Preview" className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xs text-muted-foreground">No image</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:bg-primary file:text-primary-foreground file:rounded file:px-3 file:py-1"
                          />
                          {(imagePreview || field.value) && (
                            <Button type="button" variant="outline" size="sm" onClick={handleClearImage}>
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="col-span-2 mt-4 flex gap-2">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition"
                    disabled={addLoading}
                  >
                    {addLoading ? "Adding..." : "Add Product"}
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={addLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Card>
      
      {/* Main Content */}
      <main className="flex-1 flex justify-center items-start px-2 pb-8">
        <Card className="w-full max-w-6xl shadow-xl p-0 overflow-x-auto">
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("title")}
                  >
                    <span className="flex items-center gap-1">
                      Title
                      {sortField === "title" && (
                        sortOrder === "asc" ? (
                          <span>&uarr;</span>
                        ) : (
                          <span>&darr;</span>
                        )
                      )}
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("price")}
                  >
                    <span className="flex items-center gap-1">
                      Price
                      {sortField === "price" && (
                        sortOrder === "asc" ? (
                          <span>&uarr;</span>
                        ) : (
                          <span>&darr;</span>
                        )
                      )}
                    </span>
                  </TableHead>
                  {!isMobile && (
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("rating")}
                    >
                      <span className="flex items-center gap-1">
                        Rating
                        {sortField === "rating" && (
                          sortOrder === "asc" ? (
                            <span>&uarr;</span>
                          ) : (
                            <span>&darr;</span>
                          )
                        )}
                      </span>
                    </TableHead>
                  )}
                  {!isMobile && <TableHead>Brand</TableHead>}
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-28 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? skeletonRows.map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell>
                          <div className="h-16 w-16 rounded-md bg-muted" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 rounded bg-muted" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-12 rounded bg-muted" />
                        </TableCell>
                        {!isMobile && (
                          <TableCell>
                            <div className="h-4 w-10 rounded bg-muted" />
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell>
                            <div className="h-4 w-16 rounded bg-muted" />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="h-4 w-10 rounded bg-muted" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-24 rounded bg-muted" />
                        </TableCell>
                      </TableRow>
                    ))
                  : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <span className="text-destructive font-medium">{error}</span>
                        </TableCell>
                      </TableRow>
                    ) : paginatedProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <span className="text-muted-foreground">No products found.</span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProducts.map((product) => (
                        <TableRow
                          key={product.id}
                          className="transition-colors hover:bg-accent/40 cursor-pointer"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <TableCell>
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="h-16 w-16 object-cover rounded-md border"
                              width={64}
                              height={64}
                            />
                          </TableCell>
                          <TableCell className="font-medium max-w-[180px] truncate">
                            {product.title}
                          </TableCell>
                          <TableCell>
                            ${product.price.toFixed(2)}
                          </TableCell>
                          {!isMobile && (
                            <TableCell className="flex items-center gap-1">
                              <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                              <span>{product.rating.toFixed(1)}</span>
                            </TableCell>
                          )}
                          {!isMobile && (
                            <TableCell>
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {product.brand}
                              </Badge>
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge
                              className={cn(
                                "text-xs px-2 py-1",
                                product.stock < 10
                                  ? "bg-red-500/20 text-red-700"
                                  : product.stock < 50
                                  ? "bg-yellow-400/20 text-yellow-700"
                                  : "bg-green-500/20 text-green-700"
                              )}
                            >
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2 justify-center">
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100 hover:text-blue-600" aria-label="View">
                              <Eye size={18} />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-yellow-100 hover:text-yellow-600" aria-label="Edit">
                              <Pencil size={18} />
            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-red-100 hover:text-red-600" aria-label="Delete">
                              <Trash size={18} />
            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
              </TableBody>
            </Table>
            {/* Pagination below table */}
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
              onPageChange={setPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredProducts.length}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}
