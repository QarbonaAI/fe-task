import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products – MyShop",
  description: "Browse our complete product catalog",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
