"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Star, Package, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENDPOINT } from "@/app/page";
import Image from "next/image";
import Navbar from "@/components/navbar";

interface ProductDetail {
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  minimumOrderQuantity?: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<ProductDetail>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await axios.get(`${ENDPOINT}/products/${productId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2">
        <Loader className="animate-spin" />
        Loading details...
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!product) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const discountedPrice =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-foreground text-3xl font-bold">
            {product.title}
          </h1>
          <p className="text-foreground/60">
            {product.brand} • {product.category}
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-94 w-full">
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={400}
                height={400}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x400?text=Image+Not+Found";
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-600">
                        ${discountedPrice.toFixed(2)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-foreground/60 text-lg line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.discountPercentage > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {product.discountPercentage.toFixed(0)}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="mb-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span
                    className={`font-medium ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {product.availabilityStatus && (
                  <Badge
                    variant={
                      product.availabilityStatus === "In Stock"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {product.availabilityStatus}
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-foreground/60 text-sm font-medium">
                      Brand
                    </p>
                    <p className="text-sm">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-sm font-medium">
                      Category
                    </p>
                    <p className="text-sm capitalize">{product.category}</p>
                  </div>
                  {product.minimumOrderQuantity && (
                    <div>
                      <p className="text-foreground/60 text-sm font-medium">
                        Min. Order
                      </p>
                      <p className="text-sm">
                        {product.minimumOrderQuantity} units
                      </p>
                    </div>
                  )}
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-500">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
