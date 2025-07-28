import { fetchProductById } from "@/api";
import EditProductClient from "./edit-product-client";

export default async function EditPage({ params }: { params: { id: string } }) {
  const product = await fetchProductById(params.id);
  return <EditProductClient product={product} />;
}
