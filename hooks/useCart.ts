'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ShopifyCart, CartItem } from '@/lib/shopify/types';

interface UseCartReturn {
  cart: ShopifyCart | null;
  loading: boolean;
  error: string | null;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export function useCart(cartId?: string): UseCartReturn {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cart?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCart = useCallback(async (items: CartItem[] = []) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create cart');
      }
      
      const data = await response.json();
      setCart(data.cart);
      return data.cart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = useCallback(async (item: CartItem) => {
    if (!cart?.id) {
      await createCart([item]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id, items: [item] }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [cart?.id, createCart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!cart?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          cartId: cart.id, 
          lineUpdates: [{ id: lineId, quantity }] 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
      
      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [cart?.id]);

  const removeItem = useCallback(async (lineId: string) => {
    if (!cart?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId: cart.id, lineIds: [lineId] }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      
      const data = await response.json();
      setCart(data.cart);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [cart?.id]);

  const clearCart = useCallback(async () => {
    if (!cart?.id) return;
    const lineIds = cart.lines.map(line => line.id);
    for (const id of lineIds) {
      await removeItem(id);
    }
  }, [cart?.id, cart?.lines, removeItem]);

  const refreshCart = useCallback(async () => {
    if (cartId) {
      await fetchCart(cartId);
    }
  }, [cartId, fetchCart]);

  useEffect(() => {
    if (cartId) {
      fetchCart(cartId);
    }
  }, [cartId, fetchCart]);

  return {
    cart,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };
}
