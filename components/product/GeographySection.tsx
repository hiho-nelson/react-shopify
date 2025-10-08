import Image from "next/image";
import { RichText } from "@shopify/hydrogen-react";
import type { ShopifyProduct } from "@/lib/shopify/types";

interface GeographySectionProps {
  product: ShopifyProduct;
}

export function GeographySection({ product }: GeographySectionProps) {
  return (
    <section
      id="capture-notes"
      className="my-16 md:my-24 bg-[#e8ebe4] scroll-mt-28 md:scroll-mt-40"
    >
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-start p-4 sm:p-12 lg:p-12">
        {/* Left text */}
        <div>
          <h3 className="text-4xl md:text-6xl font-thin text-gray-900 mb-12">
            Geography
          </h3>
          <div className="text-neutral-700 leading-relaxed text-[16px]">
            {product.metafields?.capture_notes?.value && (
              <div className="mt-4">
                <div className="prose prose-sm md:prose-base text-gray-600 max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-em:text-gray-700 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
                  <RichText data={product.metafields.capture_notes.value} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right map */}
        <div className="p-4 md:p-6">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
            {product.metafields?.custom?.geography_map?.value ? (
              <Image
                src={product.metafields.custom.geography_map.value}
                alt="Geography map"
                fill
                className="object-contain transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                priority={false}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No map available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


