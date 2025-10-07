"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { AddToCartButton } from "./AddToCartButton";
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify/types";
import { ProductGallery } from "./ProductGallery";
import Image from "next/image";

interface ProductPageContentProps {
  product: ShopifyProduct;
}

export function ProductPageContent({ product }: ProductPageContentProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(
    product.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  // 选项名称顺序（例如：Size, Colour）
  const optionNames = useMemo(() => {
    const first = product.variants[0]?.selectedOptions || [];
    return first.map((o) => o.name);
  }, [product.variants]);

  // 每个选项的可选值集合
  const optionValuesByName = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const name of optionNames) {
      map.set(name, []);
    }
    for (const v of product.variants) {
      for (const o of v.selectedOptions) {
        if (!map.has(o.name)) map.set(o.name, []);
        const arr = map.get(o.name)!;
        if (!arr.includes(o.value)) arr.push(o.value);
      }
    }
    return map;
  }, [product.variants, optionNames]);

  // 是否需要展示选项（至少一个选项存在 2 个以上可选值）
  const hasVariantOptions = useMemo(() => {
    if (optionNames.length === 0) return false;
    for (const name of optionNames) {
      const values = optionValuesByName.get(name) || [];
      if (values.length > 1) return true;
    }
    return false;
  }, [optionNames, optionValuesByName]);

  // 计算变体价格区间
  const { minPrice, maxPrice, currency } = useMemo(() => {
    const prices = product.variants
      .map((v) => parseFloat(v.price.amount))
      .filter((n) => !Number.isNaN(n));
    const cur =
      product.variants[0]?.price.currencyCode || product.price.currencyCode;
    if (prices.length === 0) {
      const single = parseFloat(product.price.amount);
      return { minPrice: single, maxPrice: single, currency: cur };
    }
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { minPrice: min, maxPrice: max, currency: cur };
  }, [product.variants, product.price]);

  const formatMoney = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [currency]);

  // 当前选择的选项值
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const init: Record<string, string> = {};
    (selectedVariant?.selectedOptions || []).forEach((o) => {
      init[o.name] = o.value;
    });
    return init;
  });

  // 根据选择的选项匹配变体
  useEffect(() => {
    const match = product.variants.find((variant) =>
      variant.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
    );
    setSelectedVariant(match || null);
  }, [product.variants, selectedOptions]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto px-4 sm:px-12 lg:px-12 py-8 mt-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 md:mb-6 text-sm text-gray-500"
        >
          <ol className="flex flex-wrap items-center gap-1 md:gap-2">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                Products
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 truncate max-w-[70vw] md:max-w-none">
              {product.title}
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 产品图片 */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ProductGallery images={product.images} />
          </div>

          {/* 产品信息 */}
          <div className="space-y-5 md:space-y-6 lg:space-y-8 lg:col-span-5 xl:col-span-4">
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

              <div className="text-2xl md:text-2xl font-thin text-gray-900 mt-3 md:mt-4">
                {minPrice !== maxPrice
                  ? `${formatMoney.format(minPrice)} – ${formatMoney.format(maxPrice)}`
                  : `${formatMoney.format(minPrice)}`}
              </div>
            </div>

            {/* 变体选择（下拉） */}
            {/* Learn More anchor to map section */}
            <div className="pt-2 md:pt-3">
              <div className="w-full md:w-1/2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('geography');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block w-full h-14 text-center text-lg rounded-none font-extralight border border-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Learn more
                </button>
              </div>
            </div>

            {hasVariantOptions && (
              <div className="pt-2 md:pt-3">
                <div className="flex flex-col gap-3">
                  {optionNames.map((name) => {
                    const values = optionValuesByName.get(name) || [];
                    return (
                      <div key={name} className="flex">
                        <div className="w-full md:w-2/3">
                          <Select
                            ariaLabel={name}
                            value={selectedOptions[name] || values[0] || ""}
                            onValueChange={(val) =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [name]: val,
                              }))
                            }
                            options={values.map((v) => ({
                              value: v,
                              label: v,
                            }))}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {selectedVariant?.availableForSale
                    ? "Available"
                    : "Out of Stock"}
                </div>
              </div>
            )}

            {selectedVariant && (
              <div className="mt-2 text-base md:text-4xl font-thin text-gray-900">
                {formatMoney.format(parseFloat(selectedVariant.price.amount))}
              </div>
            )}
            {/* 数量选择 */}
            <div className="pt-2 md:pt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart 按钮 */}
            <div className="space-y-4 md:space-y-5 pt-2 md:pt-4">
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
              <div className="w-full justify-between lg:justify-start flex gap-10">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('full-image');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block h-14 text-center text-lg rounded-none font-extralight text-black  hover:text-[#a1a1a1] transition-colors cursor-pointer"
                >
                  See full image &gt;
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('full-image');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block h-14 text-center text-lg rounded-none font-extralight text-black  hover:text-[#a1a1a1] transition-colors cursor-pointer"
                >
                  See finish options &gt;
                </button>
              </div>
            </div>

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

        {/* Payment / Finance info section */}
        <div className="mt-12 md:my-24">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-8 md:gap-12">
            {/* Left: Payment / delivery (arrow belongs to left) */}
            <div className="relative md:pr-10 md:min-h-[120px]">
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Payment / delivery
              </h3>
              <p className="text-gray-700 mb-2">
                Prices include taxes and free delivery worldwide.
              </p>
              <p className="text-gray-500 text-sm">
                * Excludes China, Philippines & Brazil. We will be in touch with
                shipping quotation.
              </p>
              {/* Arrow - visually part of left block */}
              <svg
                className="hidden md:block absolute right-[-22px] top-1/2 -translate-y-1/2 h-8 w-8 text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>

            {/* Middle divider */}
            <div className="hidden md:flex flex-col items-center">
              <div className="w-px h-28 bg-gray-300" />
            </div>

            {/* Right: Interest free finance options */}
            <div>
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
                Interest free finance options
              </h3>
              <p className="text-gray-700">
                Through our partnership with{" "}
                <a
                  href="https://myart.co.nz"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-gray-900"
                >
                  myart.co.nz
                </a>
                , you can purchase your piece today and pay your picture off
                over a nine-month month interest-free period. Myart.co.nz is a
                non-profit organisation supporting artists in New Zealand and
                Australia.
              </p>
            </div>
          </div>
        </div>

        {/* Geography section */}
        <section id="geography" className="my-16 md:my-24 bg-[#e8ebe4] scroll-mt-28 md:scroll-mt-40">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-10 md:gap-16 items-start p-4 sm:p-12 lg:p-12">
            {/* Left text */}
            <div>
              <h3 className="text-4xl md:text-6xl font-thin text-gray-900 mb-12">
                Geography
              </h3>
              <h4 className="text-2xl md:text-4xl font-thin text-gray-900 mb-4">
                {product.title}
              </h4>
              <div className="text-neutral-700 leading-relaxed text-[16px]">
                <p className="mb-4">
                  Lake Brunner is the largest lake on the West Coast of the
                  South Island, located 37km inland from Greymouth. This serene
                  body of water was carved by glacial action during the last ice
                  age and is surrounded by ancient podocarp forest, particularly
                  kahikatea trees, which create the distinctive partially
                  submerged forest scenes along its edges. The lake is a popular
                  destination for both its natural beauty and recreational
                  activities. Renowned for its brown trout fishing, visitors can
                  also enjoy kayaking, boating, or walking the many tracks
                  around the lake’s edge. The small settlement of Moana provides
                  a perfect base for exploring this stunning West Coast
                  landmark.
                </p>
              </div>
            </div>

            {/* Right map */}
            <div className="p-4 md:p-6">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/assets/Lake_Brunner-map.png"
                  alt="New Zealand map"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Full image section */}
        {product.images[0] && (
          <section id="full-image" className="my-16 md:my-24 scroll-mt-28 md:scroll-mt-40">
            <div className="w-full">
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.title}
                width={product.images[0].width}
                height={product.images[0].height}
                className="w-full"
                sizes="(min-width: 1280px) 1200px, 100vw"
                priority={false}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
