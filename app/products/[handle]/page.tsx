import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/shopify/actions';
import { ProductPageContent } from '@/components/shopify/ProductPageContent';
import { LoadingPage } from '@/components/ui/loading';
import type { Metadata } from 'next';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

// 生成动态元数据
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const title = `${product.title} | Shopify Store`;
  const description = product.description 
    ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : `Buy ${product.title} at Shopify Store. High quality products with fast shipping.`;

  return {
    title,
    description,
    keywords: product.tags,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.images.length > 0 ? [
        {
          url: product.images[0].url,
          width: product.images[0].width,
          height: product.images[0].height,
          alt: product.images[0].altText || product.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images.length > 0 ? [product.images[0].url] : [],
    },
    alternates: {
      canonical: `/products/${handle}`,
    },
  };
}

function ProductPageContentWrapper({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<LoadingPage message="Loading product details..." />}>
      <ProductPageContentAsync params={params} />
    </Suspense>
  );
}

async function ProductPageContentAsync({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return <ProductPageContent product={product} />;
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductPageContentWrapper params={params} />;
}
