import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products – MyShop",
  description: "Browse and manage products",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}