import type { Metadata } from "next";
import { getProduct } from "@/api/product";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  try {
    const { id } = await params;
    
    const product = await getProduct(parseInt(id));
    return {
      title: `${product.title} – MyShop`,
      description: product.description,
    };
  } catch (error) {
    return {
      title: "Product Not Found – MyShop",
      description: "The requested product could not be found",
    };
  }
}

export default function ProductLayout({ children }: ProductLayoutProps) {
  return <>{children}</>;
} 