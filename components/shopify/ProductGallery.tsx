'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShopifyImage } from '@/lib/shopify/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, Navigation, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/style.css';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
  images: ShopifyImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden aspect-video md:aspect-[4/3]">
        <Gallery withCaption>
          <Swiper
            modules={[Thumbs, FreeMode, Navigation, Zoom]}
            navigation
            zoom
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="h-full"
            style={{
              // @ts-expect-error: CSS custom properties for Swiper
              '--swiper-navigation-color': '#ffffff',
              '--swiper-navigation-size': '20px'
            }}
          >
            {images.map((image) => (
              <SwiperSlide key={image.id}>
                <Item
                  original={image.url}
                  thumbnail={image.url}
                  width={image.width}
                  height={image.height}
                  caption={image.altText || 'Product image'}
                >
                  {({ ref, open }) => (
                    <button
                      ref={(el) => {
                        // forward button element to photoswipe ref (expects HTMLElement | null)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (ref as any)(el);
                      }}
                      onClick={open}
                      className="relative block w-full h-full"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText || 'Product image'}
                        fill
                        className="object-cover transition-opacity duration-500 ease-in-out"
                        priority
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    </button>
                  )}
                </Item>
              </SwiperSlide>
            ))}
          </Swiper>
        </Gallery>
      </div>

      {images.length > 1 && (
        <div className="mt-3">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Thumbs, FreeMode]}
            spaceBetween={8}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
          >
            {images.map((image) => (
              <SwiperSlide key={`thumb-${image.id}`}>
                <div className="relative aspect-square overflow-hidden border border-gray-200">
                  <Image
                    src={image.url}
                    alt={image.altText || 'Product thumbnail'}
                    fill
                    className="object-cover transition-opacity duration-300 ease-in-out"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    priority={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;


