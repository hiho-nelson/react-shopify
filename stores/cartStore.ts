'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ShopifyCart, CartItem } from '@/lib/shopify/types';

interface CartState {
  cart: ShopifyCart | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  updatingLineIds: Set<string>;
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
  isLineUpdating: (lineId: string) => boolean;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // State
      cart: null,
      loading: false,
      error: null,
      isOpen: false,
      updatingLineIds: new Set<string>(),

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
        const { cart, updatingLineIds } = get();
        if (!cart?.id) return;
        
        // Store original state for rollback
        const originalCart = JSON.parse(JSON.stringify(cart));
        const originalLine = cart.lines.find(line => line.id === lineId);
        if (!originalLine) return;
        
        // Optimistic update: immediately update the UI
        const updatedCart = {
          ...cart,
          lines: cart.lines.map(line => 
            line.id === lineId 
              ? { ...line, quantity }
              : line
          ),
          cost: {
            ...cart.cost,
            totalAmount: {
              ...cart.cost.totalAmount,
              amount: (parseFloat(cart.cost.totalAmount.amount) + 
                (quantity - originalLine.quantity) * parseFloat(originalLine.cost.totalAmount.amount)).toString()
            }
          }
        };
        
        // Mark line as updating and update cart optimistically
        const newUpdatingLineIds = new Set(updatingLineIds);
        newUpdatingLineIds.add(lineId);
        set({ 
          cart: updatedCart, 
          updatingLineIds: newUpdatingLineIds,
          error: null 
        });
        
        try {
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
          
          // Remove from updating set and confirm the update
          const finalUpdatingLineIds = new Set(updatingLineIds);
          finalUpdatingLineIds.delete(lineId);
          set({ 
            cart: data.cart, 
            updatingLineIds: finalUpdatingLineIds,
            loading: false 
          });
        } catch (error) {
          console.error('Zustand: Error updating cart', error);
          
          // Rollback to original state
          const finalUpdatingLineIds = new Set(updatingLineIds);
          finalUpdatingLineIds.delete(lineId);
          set({ 
            cart: originalCart,
            updatingLineIds: finalUpdatingLineIds,
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          });
        }
      },

      removeItem: async (lineId: string) => {
        const { cart, updatingLineIds } = get();
        if (!cart?.id) return;
        
        // Store original state for rollback
        const originalCart = JSON.parse(JSON.stringify(cart));
        const lineToRemove = cart.lines.find(line => line.id === lineId);
        if (!lineToRemove) return;
        
        // Optimistic update: immediately remove from UI
        const updatedCart = {
          ...cart,
          lines: cart.lines.filter(line => line.id !== lineId),
          totalQuantity: cart.totalQuantity - lineToRemove.quantity,
          cost: {
            ...cart.cost,
            totalAmount: {
              ...cart.cost.totalAmount,
              amount: (parseFloat(cart.cost.totalAmount.amount) - 
                parseFloat(lineToRemove.cost.totalAmount.amount)).toString()
            }
          }
        };
        
        // Mark line as updating and update cart optimistically
        const newUpdatingLineIds = new Set(updatingLineIds);
        newUpdatingLineIds.add(lineId);
        set({ 
          cart: updatedCart, 
          updatingLineIds: newUpdatingLineIds,
          error: null 
        });
        
        try {
          const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: cart.id, lineIds: [lineId] }),
          });
          
          if (!response.ok) throw new Error('Failed to remove item');
          const data = await response.json();
          
          // Remove from updating set and confirm the update
          const finalUpdatingLineIds = new Set(updatingLineIds);
          finalUpdatingLineIds.delete(lineId);
          set({ 
            cart: data.cart, 
            updatingLineIds: finalUpdatingLineIds,
            loading: false 
          });
        } catch (error) {
          console.error('Zustand: Error removing item', error);
          
          // Rollback to original state
          const finalUpdatingLineIds = new Set(updatingLineIds);
          finalUpdatingLineIds.delete(lineId);
          set({ 
            cart: originalCart,
            updatingLineIds: finalUpdatingLineIds,
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
      
      isLineUpdating: (lineId: string) => {
        const { updatingLineIds } = get();
        return updatingLineIds.has(lineId);
      },
    }),
    {
      name: 'shopify-cart-storage',
      // use default localStorage; no custom hydration flags
      partialize: (state) => ({
        cart: state.cart,
        isOpen: state.isOpen,
        // Don't persist loading, error, or updatingLineIds as they are temporary states
      }),
    }
  )
);
