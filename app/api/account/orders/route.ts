import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ orders: [] }, { status: 401 });
    const orders = await shopifyClient.customerOrders(token, 20);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}


