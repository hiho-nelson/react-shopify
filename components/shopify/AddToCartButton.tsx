'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types';

interface AddToCartButtonProps {
  product: ShopifyProduct;
  variant?: ShopifyVariant;
  quantity?: number;
  className?: string;
}

export function AddToCartButton({ 
  product, 
  variant, 
  quantity = 1,
  className 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, openCart } = useCartStore();

  const selectedVariant = variant || product.variants[0];
  const isAvailable = selectedVariant?.availableForSale && product.availableForSale;

  const handleAddToCart = async () => {
    if (!isAvailable || !selectedVariant) return;

    try {
      setIsAdding(true);
      console.log('Adding to cart:', {
        variantId: selectedVariant.id,
        quantity,
        product: product.title
      });
      
      await addItem({
        variantId: selectedVariant.id,
        quantity,
        merchandise: {
          id: selectedVariant.id,
          title: selectedVariant.title,
          product,
        },
      });
      
      console.log('Successfully added to cart');
      // 打开购物车侧边栏
      openCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isAvailable) {
    return (
      <Button 
        disabled 
        className={className}
        variant="outline"
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleAddToCart}
      disabled={isAdding}
      className={className}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
