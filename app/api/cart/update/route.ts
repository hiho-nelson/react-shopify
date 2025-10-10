import { NextRequest, NextResponse } from 'next/server';
import { updateCartLines } from '@/lib/shopify/actions';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartId, lineUpdates } = body;

    console.log('Cart update request:', { cartId, lineUpdates });

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
      console.error('updateCartLines returned null for:', { cartId, lineUpdates });
      return NextResponse.json(
        { error: 'Failed to update cart' },
        { status: 500 }
      );
    }

    console.log('Cart update successful:', { cartId, updatedLines: cart.lines.length });
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error updating cart:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      body: await request.clone().json().catch(() => 'Failed to parse body')
    });
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
