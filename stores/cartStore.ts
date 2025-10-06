'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopifyCart, CartItem } from '@/lib/shopify/types';

interface CartState {
  cart: ShopifyCart | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

interface CartActions {
  setCart: (cart: ShopifyCart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: (cartId: string) => Promise<void>;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // State
      cart: null,
      loading: false,
      error: null,
      isOpen: false,

      // Actions
      setCart: (cart) => set({ cart, loading: false, error: null }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (item: CartItem) => {
        try {
          set({ loading: true, error: null });
          
          const { cart } = get();
          
          if (!cart?.id) {
            // 创建新购物车
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: [item] }),
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to create cart: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();
            
            if (!data.cart) {
              throw new Error('No cart data in response');
            }
            
            // 更新状态 (Zustand persist 会自动保存到 localStorage)
            set({ cart: data.cart, loading: false, error: null });
          } else {
            // 添加到现有购物车
            const response = await fetch('/api/cart/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cartId: cart.id, items: [item] }),
            });
            
            if (!response.ok) throw new Error('Failed to add item');
            const data = await response.json();
            set({ cart: data.cart, loading: false });
          }
        } catch (error) {
          console.error('Error adding item to cart:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          });
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        const { cart } = get();
        if (!cart?.id) return;
        
        try {
          set({ loading: true, error: null });
          
          const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              cartId: cart.id, 
              lineUpdates: [{ id: lineId, quantity }] 
            }),
          });
          
          if (!response.ok) throw new Error('Failed to update cart');
          const data = await response.json();
          set({ cart: data.cart, loading: false });
        } catch (error) {
          console.error('Zustand: Error updating cart', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          });
        }
      },

      removeItem: async (lineId: string) => {
        const { cart } = get();
        if (!cart?.id) return;
        
        try {
          set({ loading: true, error: null });
          
          const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: cart.id, lineIds: [lineId] }),
          });
          
          if (!response.ok) throw new Error('Failed to remove item');
          const data = await response.json();
          set({ cart: data.cart, loading: false });
        } catch (error) {
          console.error('Zustand: Error removing item', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          });
        }
      },

      clearCart: async () => {
        const { cart, removeItem } = get();
        if (!cart?.id) return;
        
        const lineIds = cart.lines.map(line => line.id);
        for (const lineId of lineIds) {
          await removeItem(lineId);
        }
      },

      loadCart: async () => Promise.resolve(),
    }),
    {
      name: 'shopify-cart-storage',
      // use default localStorage; no custom hydration flags
    }
  )
);
