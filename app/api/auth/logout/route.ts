import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const res = NextResponse.json({ ok: true });
    if (token) {
      await shopifyClient.customerAccessTokenDelete(token);
    }
    res.cookies.delete(COOKIE_NAME);
    return res;
  } catch {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}


