import { useMemo } from "react";
import type { ShopifyProduct } from "@/lib/shopify/types";

export function useProductPrice(product: ShopifyProduct) {
  // 计算变体价格区间
  const { minPrice, maxPrice, currency } = useMemo(() => {
    const prices = product.variants
      .map((v) => parseFloat(v.price.amount))
      .filter((n) => !Number.isNaN(n));
    const cur =
      product.variants[0]?.price.currencyCode || product.price.currencyCode;
    if (prices.length === 0) {
      const single = parseFloat(product.price.amount);
      return { minPrice: single, maxPrice: single, currency: cur };
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { minPrice: min, maxPrice: max, currency: cur };
  }, [product.variants, product.price]);

  const formatMoney = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currency]);

  return {
    minPrice,
    maxPrice,
    currency,
    formatMoney,
  };
}
