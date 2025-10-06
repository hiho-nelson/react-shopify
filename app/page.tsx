import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shopify/ProductGrid";
import { HeroBanner } from "@/components/shopify/HeroBanner";
import { LoadingSection } from "@/components/ui/loading";
import { getProducts } from "@/lib/shopify/actions";
import { Suspense } from "react";

function FeaturedProducts() {
  return (
    <Suspense fallback={<LoadingSection message="Loading featured products..." />}>
      <FeaturedProductsContent />
    </Suspense>
  );
}

async function FeaturedProductsContent() {
  const { products: featuredProducts } = await getProducts(8);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our most popular products and discover something amazing
          </p>
        </div>
        
        <ProductGrid products={featuredProducts} />
        
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  // Hero banner 数据
  const heroSlides = [
    {
      id: 'slide-1',
      image: {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        alt: 'Modern shopping experience',
        width: 2070,
        height: 1380,
      },
      title: 'Welcome to Our Store',
      subtitle: 'Discover amazing products with seamless shopping experience',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      ctaSecondaryText: 'Browse Collections',
      ctaSecondaryLink: '/collections',
    },
    {
      id: 'slide-2',
      image: {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        alt: 'Quality products',
        width: 2340,
        height: 1560,
      },
      title: 'Quality Guaranteed',
      subtitle: 'High-quality products with satisfaction guarantee and fast shipping',
      ctaText: 'Explore Products',
      ctaLink: '/products',
      ctaSecondaryText: 'Learn More',
      ctaSecondaryLink: '/about',
    },
    {
      id: 'slide-3',
      image: {
        url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        alt: 'Customer service',
        width: 2070,
        height: 1380,
      },
      title: '24/7 Support',
      subtitle: 'Round-the-clock customer support for all your needs',
      ctaText: 'Get Support',
      ctaLink: '/contact',
      ctaSecondaryText: 'View Products',
      ctaSecondaryLink: '/products',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroBanner slides={heroSlides} />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">High-quality products with satisfaction guarantee</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for your needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
