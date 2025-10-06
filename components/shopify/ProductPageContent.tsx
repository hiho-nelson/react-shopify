'use client';

import { useEffect, useMemo, useState } from 'react';
import { AddToCartButton } from './AddToCartButton';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types';
import { ProductGallery } from './ProductGallery';

interface ProductPageContentProps {
  product: ShopifyProduct;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 产品图片 */}
          <ProductGallery images={product.images} />

          {/* 产品信息 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {selectedVariant ? 
                  `${selectedVariant.price.currencyCode} ${parseFloat(selectedVariant.price.amount).toFixed(2)}` :
                  `${product.price.currencyCode} ${parseFloat(product.price.amount).toFixed(2)}`
                }
              </div>
              
              <div className="flex items-center mb-4">
                {(selectedVariant?.availableForSale ?? product.availableForSale) ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* 变体选择（下拉） */}
            {hasVariantOptions && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Options</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {optionNames.map((name) => {
                    const values = optionValuesByName.get(name) || [];
                    return (
                      <div key={name} className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-700">{name}</label>
                        <select
                          className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedOptions[name] || values[0] || ''}
                          onChange={(e) =>
                            setSelectedOptions((prev) => ({ ...prev, [name]: e.target.value }))
                          }
                        >
                          {values.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {selectedVariant?.availableForSale ? 'Available' : 'Out of Stock'}
                </div>
              </div>
            )}

            {/* 数量选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart 按钮 */}
            <div className="space-y-4">
              <AddToCartButton
                product={product}
                variant={selectedVariant || undefined}
                quantity={quantity}
                className="w-full py-3 text-lg"
              />
              
              <div className="text-sm text-gray-500">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• Secure checkout</p>
              </div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                <div 
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {product.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
