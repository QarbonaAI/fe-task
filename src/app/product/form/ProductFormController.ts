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
    id:"",
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

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: ProductFormData) => {
      const response = await axios.post(
        "https://dummyjson.com/products/add",
        newProduct,
      );
      return response.data;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(["products"], (old: any[]) => {
        if (!old) return [newProduct];
        return [...old, newProduct];
      });

      toast.success("Product added successfully", {
        style: {
          backgroundColor: "#e0f7fa",
          color: "#00796b",
          fontWeight: "bold",
        },
      });
      router.push("/");
    },
    onError: () => {
      toast.error("Failed to add product", {
        style: {
          backgroundColor: "#ffe5e5",
          color: "#d32f2f",
          fontWeight: "bold",
        },
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: ProductFormData) => {
      const response = await axios.put(
        `https://dummyjson.com/products/${productId}`,
        updatedProduct,
      );
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      // Update cached data in TanStack Query
      queryClient.setQueryData(["products"], (old: any[] = []) =>
        old.map((item) =>
          item.id === updatedProduct.id ? updatedProduct : item,
        ),
      );

      toast.success("Product updated successfully", {
        style: {
          backgroundColor: "#e0f7fa",
          color: "#00796b",
          fontWeight: "bold",
        },
      });

      router.push("/");
    },
    onError: () => {
      toast.error("Failed to update product", {
        style: {
          backgroundColor: "#ffe5e5",
          color: "#d32f2f",
          fontWeight: "bold",
        },
      });
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (!name) return;

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
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    if (index < newTags.length) {
      newTags[index] = value;
      setFormData({ ...formData, tags: newTags });
    }
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
    if (index < newReviews.length) {
      newReviews[index] = {
        ...newReviews[index],
        [field]: value,
      } as Review;
      setFormData({ ...formData, reviews: newReviews });
    }
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
        if (index < newImages.length) {
          newImages[index] = reader.result as string;
          setFormData({ ...formData, images: newImages });
        }
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      meta: {
        ...formData.meta,
        updatedAt: new Date().toISOString(),
        createdAt: isEditMode
          ? formData.meta.createdAt
          : new Date().toISOString(),
      },
    };

    if (isEditMode && productId) {
      updateProductMutation.mutate(submissionData);
    } else {
      addProductMutation.mutate({
        ...submissionData,
        id: 31, // For dummy product
      });
    }
  };

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode && productId) {
        try {
          const res = await axios.get(
            `https://dummyjson.com/products/${productId}`,
          );
          const data = res.data;

          setFormData({
            ...formData,
            ...data,
            dimensions: {
              width: data.dimensions?.width || "",
              height: data.dimensions?.height || "",
              depth: data.dimensions?.depth || "",
            },
            meta: {
              barcode: data.meta?.barcode || "",
              qrCode: data.meta?.qrCode || "",
              createdAt: data.meta?.createdAt || new Date().toISOString(),
            },
            images: data.images || [""],
            reviews: data.reviews || [
              {
                rating: "",
                comment: "",
                date: new Date().toISOString(),
                reviewerName: "",
                reviewerEmail: "",
              },
            ],
            tags: data.tags || [""],
          });
        } catch (err) {
          toast.error("Failed to fetch product");
        }
      }
    };

    fetchProduct();
  }, [isEditMode, productId]);

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
