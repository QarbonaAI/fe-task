// Create a controller to add and update product

"use client";
import type { ProductFormData, Review } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";

export const ProductFormController = (
  isEditMode: boolean,
  productId?: string,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<ProductFormData>({
    id: "",
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
    tags: [""],
    brand: "",
    sku: "",
    weight: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
    },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "",
    reviews: [
      {
        rating: "",
        comment: "",
        date: new Date().toISOString(),
        reviewerName: "",
        reviewerEmail: "",
      },
    ],
    returnPolicy: "",
    minimumOrderQuantity: "",
    meta: {
      barcode: "",
      qrCode: "",
      createdAt: undefined,
    },
    images: [""],
    thumbnail: "",
  });

  //  Mutation: Add Product
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductFormData) => {
      const res = await axios.post(
        "https://dummyjson.com/products/add",
        newProduct,
      );
      return res.data;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products"], (old: any[] = []) => [
        ...old,
        newProduct,
      ]);
      toast.success("Product added successfully");
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to add product");
    },
  });

  //  Mutation: Update Product
  const updateProductMutation = useMutation({
    mutationFn: async (updatedFields: Partial<ProductFormData>) => {
      const res = await axios.put(
        `https://dummyjson.com/products/${productId}`,
        updatedFields,
      );
      return res.data;
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(["products"], (old: any[] = []) =>
        old.map((product) =>
          product.id === updatedProduct.id
            ? { ...product, ...updatedProduct }
            : product,
        ),
      );
      toast.success("Product updated successfully");
      router.push("/");
    },
    onError: (err) => {
      toast.error("Failed to update product");
    },
  });

  //  Field Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent && child) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const handleReviewChange = (
    index: number,
    field: keyof Review,
    value: string,
  ) => {
    const newReviews = [...formData.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value } as Review;
    setFormData({ ...formData, reviews: newReviews });
  };

  const addReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          rating: "",
          comment: "",
          date: new Date().toISOString(),
          reviewerName: "",
          reviewerEmail: "",
        },
      ],
    }));
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...formData.images];
        newImages[index] = reader.result as string;
        setFormData({ ...formData, images: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          meta: {
            ...prev.meta,
            qrCode: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  //  Submit Handler with Filtered Fields for Update
 const handleSubmit = (e: FormEvent) => {
   e.preventDefault();

   const allowedFields = [
     "title",
     "description",
     "category",
     "price",
     "discountPercentage",
     "rating",
     "stock",
     "tags",
     "brand",
     "sku",
     "weight",
     "dimensions",
     "warrantyInformation",
     "shippingInformation",
     "availabilityStatus",
     "reviews",
     "returnPolicy",
     "minimumOrderQuantity",
     "meta",
     "images",
     "thumbnail",
   ];

   const filteredData = Object.fromEntries(
     Object.entries(formData).filter(([key]) => allowedFields.includes(key)),
   );

   if (isEditMode && productId) {
     updateProductMutation.mutate(filteredData as Partial<ProductFormData>);
   } else {
     addProductMutation.mutate({
       ...formData,
       id: 31, // dummy ID
     });
   }
 };

  //  Prefill form in edit mode
 React.useEffect(() => {
   const fetchProduct = async () => {
     if (isEditMode && productId) {
       const cachedProducts: ProductFormData[] =
         queryClient.getQueryData(["products"]) || [];

       let productFromCache = cachedProducts.find(
         (p) => p.id === parseInt(productId),
       );

       // 🔁 Fallback to API if not found in cache
       if (!productFromCache) {
         try {
           const res = await axios.get(
             `https://dummyjson.com/products/${productId}`,
           );
           productFromCache = res.data;
         } catch (error) {
           toast.error("Failed to fetch product from API.");
           return;
         }
       }

       if (productFromCache) {
         setFormData((prev) => ({
           ...prev,
           ...productFromCache,
           dimensions: {
             width: productFromCache.dimensions?.width || "",
             height: productFromCache.dimensions?.height || "",
             depth: productFromCache.dimensions?.depth || "",
           },
           meta: {
             barcode: productFromCache.meta?.barcode || "",
             qrCode: productFromCache.meta?.qrCode || "",
             createdAt:
               productFromCache.meta?.createdAt || new Date().toISOString(),
           },
           images: productFromCache.images || [""],
           reviews: productFromCache.reviews || [
             {
               rating: "",
               comment: "",
               date: new Date().toISOString(),
               reviewerName: "",
               reviewerEmail: "",
             },
           ],
           tags: productFromCache.tags || [""],
         }));
       }
     }
   };

   fetchProduct();
 }, [isEditMode, productId, queryClient]);

  return {
    handleChange,
    handleTagChange,
    addTag,
    handleReviewChange,
    addReview,
    handleImageChange,
    handleThumbnailChange,
    handleQRCodeChange,
    handleSubmit,
    formData,
  };
};