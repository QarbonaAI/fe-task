import ClientProductsPage from "./ClientProductsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products – QuarbonaAI",
  description: "Manage your product catalog with advanced features and analytics",
};

export default function ProductsPage() {
  return <ClientProductsPage />;
} 