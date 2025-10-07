import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/shopify/actions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const first = parseInt(searchParams.get('first') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [] });
    }

    const result = await searchProducts(query.trim(), first);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
