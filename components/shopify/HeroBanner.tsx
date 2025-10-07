'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroSlide {
  id: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

interface HeroBannerProps {
  slides: HeroSlide[];
  className?: string;
  height?: 'default' | 'full';
}

export function HeroBanner({ slides, className = '', height = 'default' }: HeroBannerProps) {
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
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
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        loop={slides.length > 1}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative overflow-hidden ${height === 'full' ? 'h-[100vh] min-h-[600px]' : 'h-[60vh] min-h-[500px] max-h-[800px]'}`}>
              <Image
                src={slide.image.url}
                alt={slide.image.alt}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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
      `}</style>
    </div>
  );
}
