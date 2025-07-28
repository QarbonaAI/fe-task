"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/hooks/use-products";
import { ArrowLeft, Star, Package, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  const { data: product, isLoading, error } = useProduct(productId);

  // Set dynamic page title
  useEffect(() => {
    if (product) {
      document.title = `${product.title} – MyShop`;
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push("/products")} className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/products")}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
              }}
            />
          </div>
          
          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/100x100?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${product.price.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    -{product.discountPercentage.toFixed(1)}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-medium text-slate-800 dark:text-slate-100">{product.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Description</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">Specifications</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">SKU:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Weight:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{product.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Dimensions:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Min. Order:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{product.minimumOrderQuantity} units</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Availability:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{product.availabilityStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Brand:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Category:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100 capitalize">{product.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Policies & Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-slate-800 dark:text-slate-100">Warranty</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{product.warrantyInformation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                <Truck className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-slate-800 dark:text-slate-100">Shipping</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{product.shippingInformation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                <RotateCcw className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-slate-800 dark:text-slate-100">Returns</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{product.returnPolicy}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-200 dark:bg-slate-700 rounded-lg">
                <Package className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1 text-slate-800 dark:text-slate-100">Stock</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{product.stock} units available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">Customer Reviews</h3>
              <div className="space-y-3">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-500 fill-current" : "text-slate-300 dark:text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-100">{review.reviewerName}</span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 