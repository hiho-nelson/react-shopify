"use client";

import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

export default function CheckoutPage() {
  const { cart } = useCartStore();

  useEffect(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      window.location.href = '/cart';
    }
  }, [cart?.checkoutUrl]);

  return null;
}
