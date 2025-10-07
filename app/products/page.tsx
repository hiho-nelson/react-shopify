import { ProductGrid } from '@/components/shopify/ProductGrid';
import { LoadingPage } from '@/components/ui/loading';
import { getProducts, searchProducts } from '@/lib/shopify/actions';
import { Suspense } from 'react';

function ProductsContent({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <Suspense fallback={<LoadingPage message="Loading products..." />}>
      <ProductsList searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsList({ searchParams }: { searchParams: { search?: string } }) {
  const searchQuery = searchParams.search;
  
  let products;
  let title = 'All Products';
  let description = 'Discover our collection of amazing products';

  if (searchQuery) {
    const searchResult = await searchProducts(searchQuery, 20);
    products = searchResult.products;
    title = `Search Results for "${searchQuery}"`;
    description = `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching your search`;
  } else {
    const result = await getProducts(20);
    products = result.products;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 lg:px-12 py-8 mt-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: { search?: string } }) {
  return <ProductsContent searchParams={searchParams} />;
}
