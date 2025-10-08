import Link from "next/link";

interface ProductBreadcrumbProps {
  productTitle: string;
}

export function ProductBreadcrumb({ productTitle }: ProductBreadcrumbProps) {
  return (
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
          {productTitle}
        </li>
      </ol>
    </nav>
  );
}


