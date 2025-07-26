// Create a controller to fetch the data from api

import { useEffect, useState } from 'react';
import axios from 'axios';

export const HomeController = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://dummyjson.com/products')
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    products,
    loading,
  };
};
