import { type Product } from "@/api";
import { type SortDirection } from "@/store/sorting";

export function sortProducts(
  products: Product[],
  sortBy: string | null,
  sortDirection: SortDirection
): Product[] {
  if (!sortBy || !sortDirection) {
    return products;
  }

  return [...products].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Product];
    let bValue: any = b[sortBy as keyof Product];

    // Handle special cases
    if (sortBy === "price" || sortBy === "discountPercentage" || sortBy === "rating" || sortBy === "stock") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    // Handle string values
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Sort logic
    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
} 