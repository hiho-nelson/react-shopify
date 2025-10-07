import Link from 'next/link';
import { Suspense } from 'react';
import { ProductGrid } from '@/components/shopify/ProductGrid';
import { LoadingSection } from '@/components/ui/loading';
import { getProducts } from '@/lib/shopify/actions';
import { Section } from '@/components/layout/Section';

async function FeaturedProductsContent() {
  const { products } = await getProducts(8);
  return (
    <Section className="bg-[#d4d4d44d]">
      <ProductGrid products={products} />
      <div className="flex justify-end mt-8 lg:mt-12">
        <Link href="/products" className="text-lg sm:text-xl lg:text-2xl font-thin text-white hover:text-gray-300 transition-colors duration-200 border-b border-white hover:border-gray-300 pb-1">View All Products</Link>
      </div>
    </Section>
  );
}

export default function FeaturedProducts() {
  return (
    <Suspense fallback={<LoadingSection message="Loading featured products..." /> }>
      {/* @ts-expect-error Server Component */}
      <FeaturedProductsContent />
    </Suspense>
  );
}


