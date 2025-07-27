import { type Metadata } from "next";
import { productsAPI } from "@/api";
import ProductDetailClient from "./product-detail-client";

interface ProductDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const productId = Number(params.id);
  
  try {
    const product = await productsAPI.getProduct(productId);
    
    return {
      title: `${product.title} | FE task QuarbonaAI`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.thumbnail ? [product.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found | FE task QuarbonaAI",
      description: "The product you're looking for doesn't exist.",
    };
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailClient productId={Number(params.id)} />;
} 