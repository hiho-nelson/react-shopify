import Link from "next/link";
import Image from "next/image";
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
    <section className="py-16 sm:py-20 lg:py-32 bg-[#1e32274d]">
      <div className="w-full px-4 sm:px-6 lg:px-[10%]">
        <div className="mb-12 lg:mb-20 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 text-white">You May Like</h2>
        </div>
        
        <ProductGrid products={featuredProducts} />
        
        <div className="flex justify-end mt-8 lg:mt-12">
          <Link href="/products" className="text-lg sm:text-xl lg:text-2xl font-thin text-white hover:text-gray-300 transition-colors duration-200 border-b border-white hover:border-gray-300 pb-1">
            View All Products
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
    },
    {
      id: 'slide-2',
      image: {
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        alt: 'Quality products',
        width: 2340,
        height: 1560,
      },
    },
    {
      id: 'slide-3',
      image: {
        url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        alt: 'Customer service',
        width: 2070,
        height: 1380,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - full height */}
      <HeroBanner slides={heroSlides} height="full" />

      {/* About Section */}
      <section className="py-16 sm:py-20 lg:py-32 bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-[10%]">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left side - Portrait Image */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="relative">
                <div className="aspect-square w-full max-w-sm mx-auto lg:mx-0 relative">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Portrait of Viktoria Haack"
                    fill
                    className="object-cover shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority
                  />
                </div>
                {/* Decorative border/shadow effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-white shadow-2xl -z-10 transform translate-x-2 translate-y-2"></div>
              </div>
            </div>

            {/* Right side - Text Content */}
            <div className="order-1 lg:order-2 lg:col-span-3 space-y-4 lg:space-y-6">
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Viktoria Haack is a globally published, multi-genre photographer, who finds profound connection in the world around her and aims to inspire a reverence for the natural world through her work.
                </h2>
                
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Originally from the UK, Viktoria has made British Columbia, Canada her home since 2007. She has a background in fine art and anthropology. This, combined with her love of the natural environment brings a unique perspective to her photography.
                </p>
              </div>
              
              <div className="pt-2 lg:pt-4">
                <button className="text-base lg:text-lg text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
                  + read more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Features */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="w-full px-[10%]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-sm lg:text-base text-gray-600">Quick and reliable delivery to your doorstep</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
              <p className="text-sm lg:text-base text-gray-600">High-quality products with satisfaction guarantee</p>
            </div>
            
            <div className="text-center md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-sm lg:text-base text-gray-600">Round-the-clock customer support for your needs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}