// Index page to edit product

"use client";
import React from "react";
import { useParams } from "next/navigation";
import ProductForm from "../../form/page";

const Edit = () => {
  const params = useParams();
  const productId = params?.id;

  if (!productId) return <p>Product ID not found</p>;

  return <ProductForm isEditMode={true} productId={productId} />;
};

export default Edit;
