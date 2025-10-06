'use client';

import { useState, useEffect } from 'react';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface UseProductsState {
  products: ShopifyProduct[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  endCursor: string | null;
}

interface UseProductsReturn extends UseProductsState {
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProducts(first: number = 20): UseProductsReturn {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: true,
    error: null,
    hasNextPage: false,
    endCursor: null,
  });

  const fetchProducts = async (after?: string, append: boolean = false) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/products?first=${first}${after ? `&after=${after}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      setState(prev => ({
        products: append ? [...prev.products, ...data.products] : data.products,
        loading: false,
        error: null,
        hasNextPage: data.pageInfo.hasNextPage,
        endCursor: data.pageInfo.endCursor,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const loadMore = async () => {
    if (state.hasNextPage && !state.loading) {
      await fetchProducts(state.endCursor, true);
    }
  };

  const refetch = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [first]);

  return {
    ...state,
    loadMore,
    refetch,
  };
}
