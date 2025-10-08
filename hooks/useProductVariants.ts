import { useEffect, useMemo, useState } from "react";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";

export function useProductVariants(product: ShopifyProduct) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    product.variants[0] || null
  );

  // 选项名称顺序（例如：Size, Colour）
  const optionNames = useMemo(() => {
    const first = product.variants[0]?.selectedOptions || [];
    return first.map((o) => o.name);
  }, [product.variants]);

  // 每个选项的可选值集合
  const optionValuesByName = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const name of optionNames) {
      map.set(name, []);
    }
    for (const v of product.variants) {
      for (const o of v.selectedOptions) {
        if (!map.has(o.name)) map.set(o.name, []);
        const arr = map.get(o.name)!;
        if (!arr.includes(o.value)) arr.push(o.value);
      }
    }
    return map;
  }, [product.variants, optionNames]);

  // 是否需要展示选项（至少一个选项存在 2 个以上可选值）
  const hasVariantOptions = useMemo(() => {
    if (optionNames.length === 0) return false;
    for (const name of optionNames) {
      const values = optionValuesByName.get(name) || [];
      if (values.length > 1) return true;
    }
    return false;
  }, [optionNames, optionValuesByName]);

  // 当前选择的选项值
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (selectedVariant?.selectedOptions || []).forEach((o) => {
      init[o.name] = o.value;
    });
    return init;
  });

  // 根据选择的选项匹配变体
  useEffect(() => {
    const match = product.variants.find((variant) =>
      variant.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
    );
    setSelectedVariant(match || null);
  }, [product.variants, selectedOptions]);

  return {
    selectedVariant,
    optionNames,
    optionValuesByName,
    hasVariantOptions,
    selectedOptions,
    setSelectedOptions,
  };
}
