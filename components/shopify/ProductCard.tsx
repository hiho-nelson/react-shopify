"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ShopifyProduct } from '@/lib/shopify/types';
import { QuickAddModal } from './QuickAddModal';
import { Plus } from 'lucide-react';

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
    <div className="group relative overflow-hidden hover:shadow-lg bg-white transition-shadow duration-300">
      <Link href={`/products/${product.handle}`}>
        <div className="aspect-square relative overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
          
          <p className="text-sm text-gray-600 line-clamp-3 border-l-1 border-black pl-3 ml-5">
            {shortDescription}
          </p>
        </div>
      </Link>
      <QuickAddModal product={product} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
