"use client";

import { useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify/types";
import { ProductGallery } from "./ProductGallery";
import { ProductBreadcrumb } from "../product/ProductBreadcrumb";
import { ProductHeader } from "../product/ProductHeader";
import { ProductNavigationButtons } from "../product/ProductNavigationButtons";
import { ProductVariantSelector } from "../product/ProductVariantSelector";
import { QuantitySelector } from "../product/QuantitySelector";
import { ProductActionButtons } from "../product/ProductActionButtons";
import { PaymentFinanceSection } from "../product/PaymentFinanceSection";
import { GeographySection } from "../product/GeographySection";
import { FullImageSection } from "../product/FullImageSection";
import { SpecificationsSection } from "../product/SpecificationsSection";
import { useProductVariants } from "@/hooks/useProductVariants";
import { useProductPrice } from "@/hooks/useProductPrice";

interface ProductPageContentProps {
  product: ShopifyProduct;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  const [quantity, setQuantity] = useState(1);
  
  const {
    selectedVariant,
    optionNames,
    optionValuesByName,
    hasVariantOptions,
    selectedOptions,
    setSelectedOptions,
  } = useProductVariants(product);

  const { minPrice, maxPrice, formatMoney } = useProductPrice(product);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-12 lg:px-12 py-8 mt-28">
        <ProductBreadcrumb productTitle={product.title} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Gallery - Sticky */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-20 scroll-optimized">
              <ProductGallery images={product.images} />
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-5 md:space-y-6 lg:space-y-8 lg:col-span-5 xl:col-span-4">
            <ProductHeader
              product={product}
              minPrice={minPrice}
              maxPrice={maxPrice}
              formatMoney={formatMoney.format}
              hasVariantOptions={hasVariantOptions}
            />

            <ProductNavigationButtons />

            {hasVariantOptions && (
              <ProductVariantSelector
                optionNames={optionNames}
                optionValuesByName={optionValuesByName}
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
                selectedVariant={selectedVariant}
              />
            )}

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            <ProductActionButtons
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              formatMoney={formatMoney.format}
            />

            {product.tags.length > 0 && (
              <div className="pt-1 md:pt-2">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <PaymentFinanceSection />
        <GeographySection product={product} />
        <FullImageSection product={product} />
        <SpecificationsSection product={product} />
      </div>
    </div>
  );
}
