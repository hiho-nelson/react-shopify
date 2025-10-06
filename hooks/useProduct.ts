'use client';

import { useState, useEffect } from 'react';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface UseProductState {
  product: ShopifyProduct | null;
  loading: boolean;
  error: string | null;
}

interface UseProductReturn extends UseProductState {
  refetch: () => Promise<void>;
}

export function useProduct(handle: string): UseProductReturn {
  const [state, setState] = useState<UseProductState>({
    product: null,
    loading: true,
    error: null,
  });

  const fetchProduct = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/products/${handle}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Product not found',
          }));
          return;
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      
      setState({
        product: data.product,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const refetch = async () => {
    await fetchProduct();
  };

  useEffect(() => {
    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  return {
    ...state,
    refetch,
  };
}
