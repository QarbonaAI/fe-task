"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { ProductDetailSkeleton } from "@/components/products/product-skeletons";
import { useState, useEffect } from "react";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [productId, setProductId] = useState<number | null>(null);

  useEffect(() => {
    void params.then(resolvedParams => {
      setProductId(parseInt(resolvedParams.id));
    });
  }, [params]);

  const { data: product, isLoading, error } = useProduct(productId ?? 0);

  if (productId === null || isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    notFound();
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="mb-8 cursor-pointer">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="group hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Products
            </Button>
          </Link>
        </nav>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="relative group">
              <div className="aspect-square relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${product.stock > 0
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  }`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {product.brand && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {product.brand}
                    </span>
                  )}
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                    {product.title}
                  </h1>
                </div>
              </div>

              {/* Enhanced Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            <div className="">
              <div className="space-y-3">
                <div className="flex items-baseline space-x-4">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      You save ${(product.price - discountedPrice).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-28 w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
            Specifications
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{product.category}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">SKU</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.sku}</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Weight</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.weight} kg</p>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Min Order</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.minimumOrderQuantity}</p>
            </div>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16 col-span-1 xl:col-span-2 pb-28">
            <div>

             <h3 className="px-6 text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                Customer Reviews
            </h3>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {review.reviewerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.reviewerName}</p>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                    }`}
                                />
                              ))}
                              <span className="ml-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        &ldquo;{review.comment}&rdquo;
                      </blockquote>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
