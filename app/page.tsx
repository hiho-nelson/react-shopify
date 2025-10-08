import { Section } from "@/components/layout/Section";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BlogTeasers from "@/components/home/BlogTeasers";
import { HeroBanner } from "@/components/shopify/HeroBanner";
import Image from "next/image";

// Featured products moved to components/home/FeaturedProducts

const heroSlides = [
    {
      id: "slide-1",
      image: {
        url: "/assets/MountSefton.jpg",
        alt: "Modern shopping experience",
        width: 2070,
        height: 1380,
      },
    },
    // {
    //   id: "slide-2",
    //   image: {
    //     url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
    //     alt: "Quality products",
    //     width: 2340,
    //     height: 1560,
    //   },
    // },
    // {
    //   id: "slide-3",
    //   image: {
    //     url: "https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    //     alt: "Customer service",
    //     width: 2070,
    //     height: 1380,
    //   },
    // },
  ];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - full height */}
      <HeroBanner slides={heroSlides} height="full" />

      {/* About Section */}
      <Section className="py-16 sm:py-20 lg:py-32 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left side - Portrait Image */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="relative">
                <div className="aspect-square w-full relative overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Portrait of Viktoria Haack"
                    fill
                    className="object-cover shadow-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHiQlJyAlJSQxMi0wMTItMTA7LjcxOi46Njc9PDxHR05HTVFTVVdZWXODhoT/2wBDARUXFx4aHjshITs6RzpHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0f/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  />
                </div>
                {/* Decorative border/shadow effect */}
                <div className="absolute inset-0 border-2 border-white shadow-2xl -z-10 transform translate-x-2 translate-y-2"></div>
              </div>
            </div>

            {/* Right side - Text Content */}
            <div className="order-1 lg:order-2 lg:col-span-3 space-y-4 lg:space-y-6">
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  Viktoria Haack is a globally published, multi-genre
                  photographer, who finds profound connection in the world
                  around her and aims to inspire a reverence for the natural
                  world through her work.
                </h2>

                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  Originally from the UK, Viktoria has made British Columbia,
                  Canada her home since 2007. She has a background in fine art
                  and anthropology. This, combined with her love of the natural
                  environment brings a unique perspective to her photography.
                </p>
              </div>

              <div className="pt-2 lg:pt-4">
                <a
                  href="#about-more"
                  className="relative inline-block text-lg sm:text-xl lg:text-2xl font-light text-gray-800 hover:text-gray-900 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:bg-gray-900 after:w-0 hover:after:w-full after:transition-all after:duration-300"
                >
                  + read more
                </a>
              </div>
            </div>
          </div>
      </Section>

     
      {/* Featured Products */}
      <FeaturedProducts />

      {/* Workshops & Mentoring Section */}
      <Section className="bg-[#c19a6e] text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 py-16">
            {[
              {
                title: 'Photography',
                desc:
                  'Small group learning provides personalized attention while fostering a collaborative environment. Discover your unique photographic style through hands-on practice, peer feedback, and expert guidance. Perfect for those who thrive in a supportive community setting.',
                linkClass: 'hover:text-gray-300',
              },
              {
                title: 'Fine Art Prints',
                desc:
                  "Tailored, flexible, and customized learning experiences designed specifically for your needs. Whether you're an individual or small group, we adapt to your schedule, skill level, and creative goals. Choose your session length and location for maximum convenience.",
                linkClass: 'hover:text-gray-600',
              },
              {
                title: 'Finishing Options',
                desc:
                  'Personalized support for your creative and professional growth. From technical skills like camera settings and composition to artistic development including style and storytelling. Includes post-processing guidance, critique sessions, and portfolio development.',
                linkClass: 'hover:text-gray-600',
                extra: 'md:col-span-2 lg:col-span-1',
              },
            ].map((item) => (
              <div key={item.title} className={`space-y-4 ${item.extra ?? ''}`}>
                <h3 className="text-2xl lg:text-3xl font-semibold">{item.title}</h3>
                <p className="leading-relaxed">{item.desc}</p>
                <a href="#" className={`inline-block transition-colors duration-200 underline ${item.linkClass}`}>Discover →</a>
              </div>
            ))}
          </div>
      </Section>

      {/* Blog Section */}
      <BlogTeasers />
    </div>
  );
}

