import { ProductCard } from './ProductCard';
import type { ShopifyProduct } from '@/lib/shopify/types';

interface ProductGridProps {
  products: ShopifyProduct[];
  isLoading?: boolean;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ProductGrid({ 
  products, 
  isLoading = false, 
  columns = { mobile: 1, tablet: 2, desktop: 3 } 
}: ProductGridProps) {
  // 生成动态grid类名
  const getGridClasses = () => {
    const mobileCols = `grid-cols-${columns.mobile || 1}`;
    const tabletCols = `sm:grid-cols-${columns.tablet || 2}`;
    const desktopCols = `lg:grid-cols-${columns.desktop || 3}`;
    return `grid ${mobileCols} ${tabletCols} ${desktopCols} gap-10`;
  };

  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className={getGridClasses()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
