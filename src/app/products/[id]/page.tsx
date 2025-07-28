"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Star, ShoppingCart, Tag, Award } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`https://dummyjson.com/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id]);

  // Update document title when product loads
  React.useEffect(() => {
    if (product) {
      document.title = `${product.title} – QuarbonaAI`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Product</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Product grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image section */}
            <div className="space-y-4">
              <div className="relative group">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 rounded-lg"></div>
              </div>
              
              {/* Additional images if available */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${product.title} ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="space-y-6">
              {/* Title and rating */}
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-muted-foreground">({product.stock} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">{product.category}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price}
                  </span>
                  {product.discountPercentage && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                {product.discountPercentage && (
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Brand */}
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg">
                  <span className="font-medium">Brand:</span> {product.brand}
                </span>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4">
                <button className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Additional details */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Product ID:</span>
                    <span className="ml-2 font-medium">{product.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2 font-medium capitalize">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <span className="ml-2 font-medium">{product.stock} units</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-2 font-medium">{product.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 