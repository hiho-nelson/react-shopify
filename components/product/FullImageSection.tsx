import Image from "next/image";
import type { ShopifyProduct } from "@/lib/shopify/types";

interface FullImageSectionProps {
  product: ShopifyProduct;
}

export function FullImageSection({ product }: FullImageSectionProps) {
  if (!product.images[0]) return null;

  return (
    <section
      id="full-image"
      className="my-16 md:my-24 scroll-mt-28 md:scroll-mt-40"
    >
      <div className="w-full">
        <Image
          src={product.images[0].url}
          alt={product.images[0].altText || product.title}
          width={product.images[0].width}
          height={product.images[0].height}
          className="w-full"
          priority={false}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
    </section>
  );
}


