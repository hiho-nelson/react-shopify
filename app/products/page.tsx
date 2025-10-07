import { ProductGrid } from '@/components/shopify/ProductGrid';
import { LoadingPage } from '@/components/ui/loading';
import { getProducts } from '@/lib/shopify/actions';
import { Suspense } from 'react';

function ProductsContent() {
  return (
    <Suspense fallback={<LoadingPage message="Loading products..." />}>
      <ProductsList />
    </Suspense>
  );
}

async function ProductsList() {
  const { products } = await getProducts(20);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 lg:px-12 py-8 mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">
            Discover our collection of amazing products
          </p>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}
