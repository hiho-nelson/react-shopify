'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroSlide {
  id: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
}

interface HeroBannerProps {
  slides: HeroSlide[];
  className?: string;
}

export function HeroBanner({ slides, className = '' }: HeroBannerProps) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white/50',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-white',
        }}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={slides.length > 1}
        className="hero-swiper"
        style={{
          '--swiper-navigation-color': '#ffffff',
          '--swiper-navigation-size': '24px',
        } as React.CSSProperties}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[60vh] min-h-[500px] max-h-[800px] overflow-hidden">
              {/* 背景图片 */}
              <Image
                src={slide.image.url}
                alt={slide.image.alt}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              
              {/* 内容 */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    
                    {/* CTA 按钮 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                      >
                        <Link href={slide.ctaLink}>
                          {slide.ctaText}
                        </Link>
                      </Button>
                      
                      {slide.ctaSecondaryText && slide.ctaSecondaryLink && (
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold"
                        >
                          <Link href={slide.ctaSecondaryLink}>
                            {slide.ctaSecondaryText}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 自定义导航按钮 */}
      {slides.length > 1 && (
        <>
          <button
            className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* 自定义样式 */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 2rem;
        }
        
        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          margin: 0 6px;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
        
        .hero-swiper .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
