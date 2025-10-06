import { CollectionCard } from '@/components/shopify/CollectionCard';
import { getCollections } from '@/lib/shopify/actions';

export default async function CollectionsPage() {
  const collections = await getCollections(10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Collections</h1>
          <p className="text-gray-600">
            Browse our curated collections
          </p>
        </div>
        
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-500">Collections will appear here once they are created.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
