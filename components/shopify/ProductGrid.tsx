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
  // Use static classes to prevent layout shift
  const getGridClasses = () => {
    const mobileCols = columns.mobile === 1 ? 'grid-cols-1' : 
                      columns.mobile === 2 ? 'grid-cols-2' : 'grid-cols-3';
    const tabletCols = columns.tablet === 1 ? 'sm:grid-cols-1' : 
                      columns.tablet === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3';
    const desktopCols = columns.desktop === 1 ? 'lg:grid-cols-1' : 
                       columns.desktop === 2 ? 'lg:grid-cols-2' : 
                       columns.desktop === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
    return `grid ${mobileCols} ${tabletCols} ${desktopCols} gap-10`;
  };

  if (isLoading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="group relative overflow-hidden bg-white">
            <div className="aspect-square relative overflow-hidden bg-gray-200 animate-pulse" />
            <div className="p-6 flex flex-col gap-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
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
    <div className={`${getGridClasses()} product-grid`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
