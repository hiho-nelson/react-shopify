import type { ShopifyProduct } from "@/lib/shopify/types";

interface ProductHeaderProps {
  product: ShopifyProduct;
  minPrice: number;
  maxPrice: number;
  formatMoney: (amount: number) => string;
  hasVariantOptions: boolean;
}

export function ProductHeader({
  product,
  minPrice,
  maxPrice,
  formatMoney,
  hasVariantOptions,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl md:text-6xl font-thin capitalize text-gray-900 mb-3 md:mb-4">
        {product.title}
      </h1>

      {product.description && (
        <div>
          <div
            className="prose prose-sm md:prose-base text-gray-600 max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      {hasVariantOptions && (
        <div className="text-2xl md:text-2xl font-thin text-gray-900 mt-3 md:mt-4">
          {minPrice !== maxPrice
            ? `${formatMoney(minPrice)} – ${formatMoney(maxPrice)}`
            : `${formatMoney(minPrice)}`}
        </div>
      )}
    </div>
  );
}


