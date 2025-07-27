"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./product-form";
import { type Product, type CreateProductData } from "@/api";
import { type ProductFormData } from "@/lib/schemas";
import { toast } from "react-toastify";

interface ProductModalProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductData) => Promise<void>;
  title: string;
}

export function ProductModal({ product, isOpen, onClose, onSubmit, title }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    try {
      setIsLoading(true);
      console.log("Submitting product data:", data); // Debug log
      await onSubmit(data);
      toast.success(product ? "Product updated successfully!" : "Product created successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving product:", error); // Debug log
      toast.error("Failed to save product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="fixed inset-0 bg-black/50" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div 
            className="relative bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div 
              className="flex items-center justify-between p-6 border-b"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold">{title}</h2>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ProductForm
                product={product}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isLoading={isLoading}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 