import Image from 'next/image';
import Link from 'next/link';
import type { ShopifyCollection } from '@/lib/shopify/types';

interface CollectionCardProps {
  collection: ShopifyCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/collections/${collection.handle}`}>
        <div className="aspect-video relative overflow-hidden">
          {collection.image ? (
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {collection.title}
          </h3>
          
          {collection.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
