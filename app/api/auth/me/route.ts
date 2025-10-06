import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ customer: null });
    const customer = await shopifyClient.getCustomerByToken(token);
    return NextResponse.json({ customer: customer || null });
  } catch {
    return NextResponse.json({ customer: null });
  }
}


