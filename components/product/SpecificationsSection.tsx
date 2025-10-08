import type { ShopifyProduct } from "@/lib/shopify/types";

interface SpecificationsSectionProps {
  product: ShopifyProduct;
}

export function SpecificationsSection({ product }: SpecificationsSectionProps) {
  return (
    <section
      id="specifications"
      className="my-16 md:my-24 bg-[#e8ebe4] scroll-mt-28 md:scroll-mt-40"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_3fr_3fr_3fr] gap-6 md:gap-8 lg:gap-12 items-start p-4 sm:p-8 md:p-12 lg:p-12">
        {/* Title column */}
        <div className="mb-8 md:mb-0 md:col-span-2 lg:col-span-1">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 leading-tight">
            Product
          </h3>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 leading-tight">
            Specification
          </h3>
        </div>

        {/* Column 1 */}
        <div className="md:border-l md:border-gray-300 md:pl-6 lg:pl-8">
          <div className="space-y-4">
            <div>
              <h4 className="text-base md:text-lg text-gray-600 tracking-wide">Print</h4>
              <p className="text-base font-bold text-gray-600 mt-2">
                Printed on Hahnemühle Photo Rag®
              </p>
              <p className="text-gray-700 leading-relaxed mt-3 text-sm md:text-[15px]">
                Each limited edition print is produced on Hahnemühle Photo Rag® 308gsm,
                one of the world's most renowned fine art papers. Made from 100% cotton with a
                softly textured surface, it delivers rich depth, exceptional colour, deep blacks,
                and striking contrast. This museum-grade paper is acid- and lignin-free, ISO 9706
                certified, and crafted for true archival quality — ensuring your print will last for
                generations.
              </p>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="md:border-l md:border-gray-300 md:pl-6 lg:pl-8">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h4 className="text-base md:text-lg text-gray-600 tracking-wide">Printed With</h4>
              <p className="text-gray-700 leading-relaxed mt-2 text-sm md:text-[15px]">
                Pigment-based inks provide exceptional longevity, delivering archival quality for
                up to 100 years when paired with UV70 glass framing.
              </p>
            </div>
            <div>
              <h4 className="text-base md:text-lg text-gray-600 tracking-wide">Frame</h4>
              <p className="text-gray-700 leading-relaxed mt-2 text-sm md:text-[15px]">
                Handcrafted in Nelson by Nelson City Framers, each frame is made from kiln-dried
                pine for strength and longevity. Finished in timeless grained black, with dimensions
                of 26mm wide × 40mm deep, offering a refined balance of depth and elegance.
              </p>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="md:border-l md:border-gray-300 md:pl-6 lg:pl-8 md:col-span-2 lg:col-span-1">
          <div className="space-y-6 md:space-y-8">
            <div>
              <h4 className="text-base md:text-lg text-gray-600 tracking-wide">Mounted On</h4>
              <p className="text-gray-700 leading-relaxed mt-2 text-sm md:text-[15px]">
                Your print is mounted on acid-free, neutral pH foam board to ensure archival
                quality and long-term preservation.
              </p>
            </div>
            <div>
              <h4 className="text-base md:text-lg text-gray-600 tracking-wide">Frame Glass</h4>
              <p className="text-gray-700 leading-relaxed mt-2 text-sm md:text-[15px]">
                Your limited addition print is protected with UV70 non-reflective glass, each
                photograph is shielded from 70% of UV light to prevent fading. The anti-reflective
                finish allows for clear, uninterrupted viewing even in bright or high-glare
                environments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


