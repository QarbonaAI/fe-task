"use client";

import { motion } from "framer-motion";
import { type Product } from "@/api";

interface AnimatedTableRowProps {
  product: Product;
  index: number;
  children: React.ReactNode;
  onClick?: () => void;
}

export function AnimatedTableRow({ product, index, children, onClick }: AnimatedTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      whileHover={{ 
        backgroundColor: "hsl(var(--muted))",
        transition: { duration: 0.2 }
      }}
      className={`${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      layout
    >
      {children}
    </motion.tr>
  );
} 