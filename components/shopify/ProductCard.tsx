"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { QuickAddModal } from './QuickAddModal';
import { Plus, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: ShopifyProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const firstImage = product.images[0];
  
  // 获取产品描述，如果没有description则使用title
  const description = product.description || product.title;
  const shortDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  return (
    <div className="group relative overflow-hidden hover:shadow-lg bg-white transition-shadow duration-300 product-card">
      <Link href={`/products/${product.handle}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100 product-image">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          
          {/* Quick Add Icon - 在图片右下角 */}
          <button
            type="button"
            className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full cursor-pointer flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
            onClick={(e) => { 
              e.preventDefault(); 
              setOpen(true); 
            }}
            disabled={!product.availableForSale}
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <h3 className="text-3xl font-light text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <div className="flex items-start gap-3">
            <p className="flex-1 text-sm text-gray-600 line-clamp-3 border-l-1 border-black pl-3">
              {shortDescription}
            </p>
            <button
              type="button"
              className="mt-0.5 w-10 h-10 flex-shrink-0 flex cursor-pointer items-center justify-center border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-black hover:text-white transition-colors duration-200"
              aria-label="View product"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Link>
      <QuickAddModal product={product} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
