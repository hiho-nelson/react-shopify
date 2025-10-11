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
  loadCart: (cartId?: string) => Promise<void>;
  isLineUpdating: (lineId: string) => boolean;
  clearError: () => void;
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
        const { cart, updatingLineIds, removeItem } = get();
        if (!cart?.id) return;
        
        // If quantity is 0, use removeItem instead of update
        if (quantity === 0) {
          await removeItem(lineId);
          return;
        }
        
        // Store original state for rollback
        const originalCart = JSON.parse(JSON.stringify(cart));
        const originalLine = cart.lines.find(line => line.id === lineId);
        if (!originalLine) return;
        
        // Optimistic update: immediately update the UI (quantity and totalQuantity)
        const updatedCart = {
          ...cart,
          lines: cart.lines.map(line => 
            line.id === lineId 
              ? { ...line, quantity }
              : line
          ),
          totalQuantity: cart.lines.reduce((sum, line) => 
            sum + (line.id === lineId ? quantity : line.quantity), 0
          )
          // Don't update costs optimistically - let Shopify calculate them
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
          // Retry logic for network issues
          let lastError;
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  cartId: cart.id, 
                  lineUpdates: [{ id: lineId, quantity }] 
                }),
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Cart update failed (attempt ${attempt}):`, {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorText,
                  cartId: cart.id,
                  lineId,
                  quantity
                });
                throw new Error(`Failed to update cart: ${response.status} ${response.statusText} - ${errorText}`);
              }
              
              const data = await response.json();
              
              // Remove from updating set and confirm the update
              set((state) => {
                const finalUpdatingLineIds = new Set(state.updatingLineIds);
                finalUpdatingLineIds.delete(lineId);
                return {
                  cart: data.cart,
                  updatingLineIds: finalUpdatingLineIds,
                  loading: false
                };
              });
              
              // Success - break out of retry loop
              return;
              
            } catch (error) {
              lastError = error;
              console.warn(`Cart update attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');
              
              // If this is not the last attempt, wait before retrying
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
              }
            }
          }
          
          // All retries failed, throw the last error
          throw lastError;
          
        } catch (error) {
          console.error('Zustand: Error updating cart after all retries', {
            error: error instanceof Error ? error.message : 'Unknown error',
            cartId: cart.id,
            lineId,
            quantity,
            originalQuantity: originalLine.quantity
          });
          
          // Rollback to original state
          set((state) => {
            const finalUpdatingLineIds = new Set(state.updatingLineIds);
            finalUpdatingLineIds.delete(lineId);
            return {
              cart: originalCart,
              updatingLineIds: finalUpdatingLineIds,
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false
            };
          });
        }
      },

      removeItem: async (lineId: string) => {
        const { cart, updatingLineIds } = get();
        if (!cart?.id) return;
        
        // Mark line as updating (no optimistic update)
        const newUpdatingLineIds = new Set(updatingLineIds);
        newUpdatingLineIds.add(lineId);
        set({ 
          updatingLineIds: newUpdatingLineIds,
          error: null 
        });
        
        try {
          // Retry logic for network issues
          let lastError;
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const response = await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId: cart.id, lineIds: [lineId] }),
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Cart remove failed (attempt ${attempt}):`, {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorText,
                  cartId: cart.id,
                  lineId
                });
                throw new Error(`Failed to remove item: ${response.status} ${response.statusText} - ${errorText}`);
              }
              
              const data = await response.json();
              
              // Remove from updating set and update cart with server response
              set((state) => {
                const finalUpdatingLineIds = new Set(state.updatingLineIds);
                finalUpdatingLineIds.delete(lineId);
                return {
                  cart: data.cart,
                  updatingLineIds: finalUpdatingLineIds,
                  loading: false
                };
              });
              
              // Success - break out of retry loop
              return;
              
            } catch (error) {
              lastError = error;
              console.warn(`Cart remove attempt ${attempt} failed:`, error instanceof Error ? error.message : 'Unknown error');
              
              // If this is not the last attempt, wait before retrying
              if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
              }
            }
          }
          
          // All retries failed, throw the last error
          throw lastError;
          
        } catch (error) {
          console.error('Zustand: Error removing item after all retries', {
            error: error instanceof Error ? error.message : 'Unknown error',
            cartId: cart.id,
            lineId
          });
          
          // Remove from updating set and show error
          set((state) => {
            const finalUpdatingLineIds = new Set(state.updatingLineIds);
            finalUpdatingLineIds.delete(lineId);
            return {
              updatingLineIds: finalUpdatingLineIds,
              error: error instanceof Error ? error.message : 'Unknown error',
              loading: false
            };
          });
        }
      },

      clearCart: async () => {
        const { cart, removeItem } = get();
        if (!cart?.id) return;
        
        const lineIds = cart.lines.map(line => line.id);
        // Use Promise.allSettled to ensure all deletions are attempted even if some fail
        await Promise.allSettled(lineIds.map(id => removeItem(id)));
      },

      loadCart: async (cartId?: string) => {
        if (!cartId) return;
        try {
          console.log('🔄 Loading cart from server:', cartId);
          set({ loading: true, error: null });
          const res = await fetch(`/api/cart?id=${cartId}`);
          
          if (!res.ok) {
            // Cart expired or not found - clear localStorage and start fresh
            if (res.status === 404) {
              console.log('❌ Cart expired (404), clearing localStorage');
              localStorage.removeItem('shopify-cart-storage');
              set({ cart: null, loading: false, error: null });
              return;
            }
            throw new Error(`Failed to load cart: ${res.status}`);
          }
          
          const data = await res.json();
          console.log('✅ Cart loaded from server:', {
            cartId: data.cart.id,
            lines: data.cart.lines.length,
            totalQuantity: data.cart.totalQuantity
          });
          
          set({ cart: data.cart, loading: false });
        } catch (error) {
          console.error('❌ Failed to load cart:', error);
          // On network error, keep trying to load next time but don't show error to user
          set({ 
            loading: false, 
            error: null // Silent failure - will retry on next page load
          });
        }
      },
      
      isLineUpdating: (lineId: string) => {
        const { updatingLineIds } = get();
        return updatingLineIds.has(lineId);
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'shopify-cart-storage',
      storage: {
        getItem: (name) => {
          // ✅ Use localStorage to persist cart across browser sessions
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
      partialize: (state) => {
        // ✅ CRITICAL: Only persist cart ID, not the entire cart object
        // This ensures data is always fetched fresh from Shopify on page load
        // We save a minimal cart object with just the ID
        return {
          cart: state.cart ? { 
            id: state.cart.id,
            lines: [],
            totalQuantity: 0,
            cost: state.cart.cost,
          } as ShopifyCart : null,
        } as any;
      },
      onRehydrateStorage: () => (state) => {
        // ✅ Always validate and reload cart from Shopify server after hydration
        const cartId = state?.cart?.id;
        if (cartId) {
          console.log('🔄 Rehydrating cart from localStorage, validating with server:', cartId);
          // Use setTimeout to ensure this runs after hydration is complete
          setTimeout(() => {
            state.loadCart(cartId);
          }, 100);
        } else {
          console.log('🔄 No cart ID found in localStorage');
        }
      },
    }
  )
);

