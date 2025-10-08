import Link from "next/link";
import { AddToCartButton } from "../shopify/AddToCartButton";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";

interface ProductActionButtonsProps {
  product: ShopifyProduct;
  selectedVariant: ShopifyVariant | null;
  quantity: number;
  formatMoney: (amount: number) => string;
}

export function ProductActionButtons({
  product,
  selectedVariant,
  quantity,
  formatMoney,
}: ProductActionButtonsProps) {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4 md:space-y-3 pt-2 md:pt-4">
      {/* Price display */}
      {selectedVariant && (
        <div className="mt-2 text-base md:text-4xl font-thin text-gray-900">
          {formatMoney(parseFloat(selectedVariant.price.amount))}
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4 md:space-y-3">
        <div className="w-full md:w-1/2">
          <AddToCartButton
            product={product}
            variant={selectedVariant || undefined}
            quantity={quantity}
            className="w-full h-14 text-lg rounded-none font-extralight"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Link
            href="/contact"
            className="block w-full h-14 leading-[56px] text-center text-lg rounded-none font-extralight text-black bg-[#b8bca5] hover:opacity-90"
          >
            Enquiry
          </Link>
        </div>
        <div className="w-full justify-between lg:justify-start flex gap-10 mt-10">
          <button
            type="button"
            onClick={() => scrollToSection("full-image")}
            className="block h-fit text-center text-lg rounded-none font-extralight text-black hover:text-[#a1a1a1] transition-colors cursor-pointer"
          >
            See full image &gt;
          </button>
          <Link
            href="/delivery"
            className="block h-fit text-center text-lg rounded-none font-extralight text-black hover:text-[#a1a1a1] transition-colors cursor-pointer"
          >
            Delivery &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}


