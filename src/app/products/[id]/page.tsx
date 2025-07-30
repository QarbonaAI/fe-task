"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/api/index";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(Number(id)),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  return (
    <>
      <Head>
        <title>{data.title} – MyShop</title>
      </Head>
      <div className="p-8">
        {/* Back button at the top */}
        <Link href="/products">
          <Button variant="outline" className="mb-4">&larr; Back to Products</Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <img src={data.thumbnail} alt={data.title} className="w-48 mb-4" />
        <p>{data.description}</p>
        <p className="mt-2">Brand: {data.brand}</p>
        <p>Price: ${data.price}</p>
        <p>Rating: {data.rating}</p>
      </div>
    </>
  );
}