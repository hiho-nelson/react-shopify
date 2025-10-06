import { NextRequest, NextResponse } from 'next/server';
import { addToCart } from '@/lib/shopify/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, items } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    const cart = await addToCart(cartId, items);

    if (!cart) {
      return NextResponse.json(
        { error: 'Failed to add items to cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add items to cart' },
      { status: 500 }
    );
  }
}
