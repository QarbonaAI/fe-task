import Navbar from "@/components/navbar";
import axios from "axios";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const res = await axios(`https://dummyjson.com/products/${params.id}`);
  const product: ProductDetail = res.data;

  return {
    title: product.title,
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
