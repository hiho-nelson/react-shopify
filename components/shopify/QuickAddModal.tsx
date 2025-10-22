'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types';
import { useCartStore } from '@/stores/cartStore';
import { useProductPrice } from '@/hooks/useProductPrice';
import { X } from 'lucide-react';

interface QuickAddModalProps {
  product: ShopifyProduct;
  open: boolean;
  onClose: () => void;
}

export function QuickAddModal({ product, open, onClose }: QuickAddModalProps) {
  const { addItem, loading, openCart } = useCartStore();
  const { minPrice, maxPrice, formatMoney } = useProductPrice(product);

  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setEntered(false);
      const t = setTimeout(() => setEntered(true), 20);
      return () => clearTimeout(t);
    }
    setEntered(false);
    const t2 = setTimeout(() => setVisible(false), 200);
    return () => clearTimeout(t2);
  }, [open]);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(product.variants[0] || null);

  const optionNames = useMemo(() => {
    return (product.variants[0]?.selectedOptions || []).map(o => o.name);
  }, [product.variants]);

  const optionValuesByName = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const name of optionNames) map.set(name, []);
    for (const v of product.variants) {
      for (const o of v.selectedOptions) {
        const arr = map.get(o.name)!;
        if (!arr.includes(o.value)) arr.push(o.value);
      }
    }
    return map;
  }, [product.variants, optionNames]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    (product.variants[0]?.selectedOptions || []).forEach(o => (init[o.name] = o.value));
    return init;
  });

  // 是否需要展示选项（至少一个选项存在 2 个以上可选值）
  const hasVariantOptions = useMemo(() => {
    if (optionNames.length === 0) return false;
    for (const name of optionNames) {
      const values = optionValuesByName.get(name) || [];
      if (values.length > 1) return true;
    }
    return false;
  }, [optionNames, optionValuesByName]);

  useEffect(() => {
    const match = product.variants.find(v => v.selectedOptions.every(o => selectedOptions[o.name] === o.value));
    setSelectedVariant(match || null);
  }, [product.variants, selectedOptions]);

  if (!visible) return null;

  const image = product.images[0];

  const handleBuyNow = async () => {
    const variantId = selectedVariant?.id || product.variants[0]?.id;
    if (!variantId) return;
    
    try {
      await addItem({ 
        variantId, 
        quantity, 
        merchandise: { 
          id: variantId, 
          title: selectedVariant?.title || product.title, 
          product 
        } 
      });
      // Open cart sidebar instead of redirecting to checkout
      openCart();
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // 使用 Portal 渲染到 document.body，确保覆盖整个屏幕
  return createPortal(
    <div 
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-200 ${entered ? 'opacity-100 bg-black/40' : 'opacity-0 bg-black/40'}`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl bg-white shadow-xl overflow-hidden transform transition-transform duration-200 ${entered ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-[500px] max-h-[80vh]">
          {/* Left Side - Product Image */}
          <div className="w-1/2 bg-gray-50 relative overflow-hidden">
            {image && (
              <Image 
                src={image.url} 
                alt={image.altText || product.title} 
                fill 
                className="object-cover transition-opacity duration-300" 
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                priority={false}
              />
            )}
          </div>

          {/* Right Side - Product Information */}
          <div className="w-1/2 bg-white p-8 flex flex-col">
            {/* Close Button */}
            <div className="flex justify-end mb-6">
              <button 
                className="h-8 w-8 grid place-items-center hover:bg-gray-100 rounded-full transition-colors" 
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Title */}
            <h2 className="text-4xl font-thin text-gray-900 mb-4 leading-tight">
              {product.title}
            </h2>

            {/* Price */}
            <div className="mb-4">
              <div className=" font-bold text-gray-600">
                {minPrice !== maxPrice
                  ? `${formatMoney.format(minPrice)} – ${formatMoney.format(maxPrice)}`
                  : formatMoney.format(minPrice)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Incl. GST</div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                  {product.description.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            )}

            {/* Variant Options */}
            {hasVariantOptions && (
              <div className="mb-4 space-y-3">
                {optionNames.map((name) => {
                  const values = optionValuesByName.get(name) || [];
                  return (
                    <div key={name}>
                      <div className="relative">
                        <select
                          className="w-full h-10 border-b border-gray-300 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors appearance-none"
                          value={selectedOptions[name] || values[0] || ''}
                          onChange={(e) => setSelectedOptions((prev) => ({ ...prev, [name]: e.target.value }))}
                        >
                          {values.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <button 
                  className="h-10 w-10 flex items-center justify-center bg-gray-50 transition-colors" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button 
                  className="h-10 w-10 flex items-center justify-center bg-gray-50 transition-colors" 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Selected Variant Price */}
            {selectedVariant && (
              <div className="mb-4">
                <div className="text-2xl font-semibold text-gray-900">
                  {formatMoney.format(parseFloat(selectedVariant.price.amount))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6">
              <button
                className="w-full h-14 bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!selectedVariant?.availableForSale || loading}
                onClick={handleBuyNow}
              >
                {loading ? 'Processing...' : 'Buy Now'}
              </button>
              
              {/* Product Page Link */}
              <div className="mt-4">
                <a
                  href={`/products/${product.handle}`}
                  className="text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                  onClick={onClose}
                >
                  View Full Product Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default QuickAddModal;