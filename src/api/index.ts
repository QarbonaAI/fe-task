import axios from 'axios';


// Types for product data
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
  rating: number;
  thumbnail: string;
  // Add other fields as needed
}

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  brand: string;
}

// Fetch products with pagination
export const fetchProducts = async (limit = 10, skip = 0) => {
  const { data } = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  return data;
};

// Fetch a single product by ID
export const fetchProduct = async (id: number) => {
  const { data } = await axios.get(`https://dummyjson.com/products/${id}`);
  return data;
};

// Add a new product
export const addProduct = async (input: ProductInput) => {
  const { data } = await axios.post(`https://dummyjson.com/products/add`, input);
  return data;
};

// Update an existing product
export const updateProduct = async (id: number, input: ProductInput) => {
  const { data } = await axios.put(
    `https://dummyjson.com/products/${id}`,
    input
  );
  return data;
};

// Delete a product
export const deleteProduct = async (id: number) => {
  const { data } = await axios.delete(`https://dummyjson.com/products/${id}`);
  return data;
};