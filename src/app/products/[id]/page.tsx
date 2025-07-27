"use client";

import { useParams, useRouter } from "next/navigation";
import { EditProductDialog } from "@/components/forms/product-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import { useProductDetail } from "@/hooks/useProductDetail";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const { data: product, isLoading, error } = useProductDetail(productId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading product...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const formattedDiscountedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(discountedPrice);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{product.brand}</p>
          </div>
          <EditProductDialog product={product} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-square w-full">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-600">Category</h4>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600">Rating</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{Number(product.rating).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-600">Stock</h4>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock} in stock
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600">Product ID</h4>
                  <span className="text-gray-700">#{product.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Original Price:</span>
                <span className="text-lg font-semibold">{formattedPrice}</span>
              </div>
              {product.discountPercentage > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <Badge variant="destructive">{product.discountPercentage}% OFF</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Final Price:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formattedDiscountedPrice}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {product.images && product.images.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Product Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {product.images.map((image : string, index : number) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 