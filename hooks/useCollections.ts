'use client';

import { useState, useEffect } from 'react';
import type { ShopifyCollection } from '@/lib/shopify/types';

interface UseCollectionsState {
  collections: ShopifyCollection[];
  loading: boolean;
  error: string | null;
}

interface UseCollectionsReturn extends UseCollectionsState {
  refetch: () => Promise<void>;
}

export function useCollections(first: number = 10): UseCollectionsReturn {
  const [state, setState] = useState<UseCollectionsState>({
    collections: [],
    loading: true,
    error: null,
  });

  const fetchCollections = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/collections?first=${first}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      
      const data = await response.json();
      
      setState({
        collections: data.collections,
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
    await fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, [first]);

  return {
    ...state,
    refetch,
  };
}
