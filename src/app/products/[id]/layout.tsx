import { type Metadata } from "next";
import { productsApi } from "@/api/products";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  try {
    const product = await productsApi.getProduct(id);
    
    return {
      title: `${product.title} – MyShop`,
      description: product.description,
      openGraph: {
        title: `${product.title} – MyShop`,
        description: product.description,
        images: [
          {
            url: product.thumbnail,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: "Product Not Found – MyShop",
      description: "The requested product could not be found.",
    };
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
