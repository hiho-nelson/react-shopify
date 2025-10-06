import { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify/actions';
import type { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  try {
    // 动态产品页面
    const { products } = await getProducts(1000); // 获取更多产品用于 sitemap
    const productPages = products.map((product: ShopifyProduct) => ({
      url: `${baseUrl}/products/${product.handle}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 动态分类页面
    const collections = await getCollections(100);
    const collectionPages = collections.map((collection: ShopifyCollection) => ({
      url: `${baseUrl}/collections/${collection.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...productPages, ...collectionPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
