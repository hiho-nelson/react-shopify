'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify/types';
import { useCartStore } from '@/stores/cartStore';
import { X } from 'lucide-react';

interface QuickAddModalProps {
  product: ShopifyProduct;
  open: boolean;
  onClose: () => void;
}

export function QuickAddModal({ product, open, onClose }: QuickAddModalProps) {
  const { addItem, openCart, loading } = useCartStore();

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
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAdd = async () => {
    const variantId = selectedVariant?.id || product.variants[0]?.id;
    if (!variantId) return;
    await addItem({ variantId, quantity, merchandise: { id: variantId, title: selectedVariant?.title || product.title, product } });
    openCart();
    onClose();
  };

  return (
    <>
      <div className={`fixed inset-0 z-[70] transition-opacity duration-200 ${entered ? 'opacity-100 bg-black/40' : 'opacity-0 bg-black/40'}`} onClick={onClose} />
      <div className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-200 ${entered ? 'scale-100' : 'scale-95'}`}>
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <button className="h-8 w-8 grid place-items-center rounded hover:bg-gray-100" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                {image && (
                  <Image src={image.url} alt={image.altText || product.title} fill className="object-cover" sizes="200px" />
                )}
              </div>
              <div className="mt-3 text-xl font-bold">
                {displayPrice.currencyCode} {parseFloat(displayPrice.amount).toFixed(2)}
              </div>
            </div>
            <div className="sm:col-span-2 space-y-4">
              {hasVariantOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {optionNames.map((name) => {
                    const values = optionValuesByName.get(name) || [];
                    return (
                      <div key={name} className="flex flex-col">
                        <label className="mb-1 text-sm text-gray-700">{name}</label>
                        <select
                          className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedOptions[name] || values[0] || ''}
                          onChange={(e) => setSelectedOptions((prev) => ({ ...prev, [name]: e.target.value }))}
                        >
                          {values.map((v) => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-700 mb-1">Quantity</label>
                <div className="flex items-center gap-2">
                  <button className="h-8 w-8 border rounded" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <span className="w-10 text-center">{quantity}</span>
                  <button className="h-8 w-8 border rounded" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <button
                className="w-full h-10 rounded-md bg-black text-white disabled:opacity-50"
                disabled={!selectedVariant?.availableForSale || loading}
                onClick={handleAdd}
              >
                Add to Cart
              </button>
              <div className="text-sm text-gray-500">
                {selectedVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickAddModal;


