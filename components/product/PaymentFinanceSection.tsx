export function PaymentFinanceSection() {
  return (
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
  );
}


