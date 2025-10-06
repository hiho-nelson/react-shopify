import { NextRequest, NextResponse } from 'next/server';
import { updateCartLines } from '@/lib/shopify/actions';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineUpdates } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    if (!lineUpdates || !Array.isArray(lineUpdates)) {
      return NextResponse.json(
        { error: 'Line updates array is required' },
        { status: 400 }
      );
    }

    const cart = await updateCartLines(cartId, lineUpdates);

    if (!cart) {
      return NextResponse.json(
        { error: 'Failed to update cart' },
        { status: 500 }
      );
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
