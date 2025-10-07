import { Suspense } from 'react';
import Image from 'next/image';
import { LoadingSection } from '@/components/ui/loading';
import { Section } from '@/components/layout/Section';
import { getBlogArticles } from '@/lib/shopify/actions';
import Link from 'next/link';

const BLOG_HANDLE = 'news';
const BLOG_FIRST = 3;

async function BlogTeasersContent() {
  const articles = await getBlogArticles(BLOG_HANDLE, BLOG_FIRST);
  return (
    <Section>
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900">Blog</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((a) => (
          <article key={a.id} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="aspect-[4/3] relative">
              {a.image ? (
                <Image src={a.image.url} alt={a.image.altText || a.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{a.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{a.excerpt || ''}</p>
              <div className="flex items-center justify-between">
                <a href={`/blog/${a.handle}`} className="text-xs sm:text-sm font-medium text-gray-900 border border-gray-300 px-3 py-1 hover:bg-gray-900 hover:text-white transition-colors duration-200">VIEW</a>
                {a.authorName && (<span className="text-xs text-gray-500">By {a.authorName}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="flex justify-end mt-8 lg:mt-12">
        <Link href="/blog" className="text-lg sm:text-xl lg:text-2xl font-thin hover:text-gray-300 transition-colors duration-200 border-b border-black hover:border-gray-300 pb-1">View All Blog Posts</Link>
      </div>
    </Section>
  );
}

export default function BlogTeasers() {
  return (
    <Suspense fallback={<LoadingSection message="Loading blog articles..." /> }>
      <BlogTeasersContent />
    </Suspense>
  );
}


