// src/api/index.ts
export async function fetchProducts({
  limit,
  skip,
  query = "",
}: {
  limit: number;
  skip: number;
  query?: string;
}) {
  const url = query
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function fetchProductById(id: string | number) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}
