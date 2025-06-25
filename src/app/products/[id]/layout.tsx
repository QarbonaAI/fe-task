import { type Metadata } from "next";
import { productsApi } from "@/api/products";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await productsApi.getProduct(Number(params.id));
    return {
      title: `${product.title} – MyShop`,
      description: product.description,
    };
  } catch {
    return {
      title: "Product – MyShop",
      description: "Product details",
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}