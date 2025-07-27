"use client";

import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Package, DollarSign, Percent, Hash } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface ProductDetailClientProps {
  productId: number;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <main className="min-h-screen overflow-auto">
        <div className="container mx-auto py-6 px-2">
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading product...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen overflow-auto">
        <div className="container mx-auto py-6 px-2">
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-2">Product not found</h2>
              <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/")}>
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </main>
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
    <main className="min-h-screen overflow-auto">
      <div className="container mx-auto py-6 px-2">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-muted-foreground">Product ID: #{product.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg border overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x400?text=No+Image";
                }}
              />
            </div>
            
            {/* Additional Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square rounded border overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {product.brand}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {product.category}
                </Badge>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </h3>
              <div className="space-y-1">
                {product.discountPercentage > 0 ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-destructive">
                        {formattedDiscountedPrice}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        {formattedPrice}
                      </span>
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        -{product.discountPercentage}%
                      </Badge>
                    </div>
                  </>
                ) : (
                  <span className="text-2xl font-bold">{formattedPrice}</span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Rating
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating.toFixed(1)}/5</span>
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Stock
              </h3>
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/products/${product.id}/edit`)}
              >
                Edit Product
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Product URL copied to clipboard!");
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 