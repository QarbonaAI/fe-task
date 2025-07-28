import { fetchProductById } from "@/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await fetchProductById(params.id);
    return {
      title: `${product.title} MyShop`,
    };
  } catch {
    return {
      title: `Product Not Found MyShop`,
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  try {
    const product = await fetchProductById(params.id);

    return (
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold">{product.title}</h1>

        <div className="flex flex-col gap-6 md:flex-row">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            className="rounded border"
          />

          <div className="space-y-2">
            <p className="text-lg">
              <strong>Brand:</strong> {product.brand}
            </p>
            <p className="text-lg">
              <strong>Price:</strong> ${product.price}
            </p>
            <p className="text-lg">
              <strong>Rating:</strong> {product.rating}
            </p>
            <p className="text-base text-gray-600">{product.description}</p>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
