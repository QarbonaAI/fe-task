// Create a detail view page of product

"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const View = () => {
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedProduct = localStorage.getItem("selectedProduct");
    if (storedProduct) {
      setProduct(JSON.parse(storedProduct));
    }
  }, []);

  if (!product) return <p className="p-4">No product found</p>;

  return (
    <div className="h-full min-h-screen overflow-y-scroll p-5">
      <Navbar />
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-red-200">
          {product.images?.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {product.images.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`Product image ${i}`}
                  className="h-140 w-200 rounded-lg object-contain"
                />
              ))}
            </div>
          )}
        </div>
        <div className="300">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(`/`);
              }}
              className="cursor-pointer"
            >
              Back to Home
            </Button>
          </div>
          <h1 className="mt-5 text-4xl font-bold">{product?.title ?? "NA"}</h1>
          <p className="mt-5 text-gray-400">{product?.description ?? "NA"}</p>
          <p className="mt-5 text-gray-400">
            <strong>Price:</strong> ${product?.price ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Discount:</strong> {product?.discountPercentage ?? "NA"}%
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Rating:</strong> {product?.rating ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Stock:</strong> {product?.stock ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Brand:</strong> {product?.brand ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Category:</strong> {product?.category ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Warranty Information:</strong>{" "}
            {product?.warrantyInformation ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Shipping Information:</strong>{" "}
            {product?.shippingInformation ?? "NA"}
          </p>
          <p className="mt-5 text-gray-400">
            <strong>Availability Status:</strong>{" "}
            {product?.availabilityStatus ?? "NA"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default View;
