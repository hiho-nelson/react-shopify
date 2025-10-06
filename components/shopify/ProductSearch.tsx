'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductGrid } from './ProductGrid';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, loading, error, loadMore, hasNextPage } = useProducts(12);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* 搜索框 */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="搜索产品..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 产品网格 */}
        <ProductGrid 
          products={filteredProducts} 
          isLoading={loading} 
        />

        {/* 错误信息 */}
        {error && (
          <div className="text-center text-red-600">
            <p>加载产品时出错: {error}</p>
          </div>
        )}

        {/* 加载更多按钮 */}
        {hasNextPage && (
          <div className="text-center">
            <Button 
              onClick={loadMore} 
              disabled={loading}
              variant="outline"
            >
              {loading ? '加载中...' : '加载更多'}
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
