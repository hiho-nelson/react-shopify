import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 401 });
    const result = await shopifyClient.customerAccessTokenRenew(token);
    if (!result.customerAccessToken) {
      const res = NextResponse.json({ error: 'Failed to renew' }, { status: 401 });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, result.customerAccessToken.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(result.customerAccessToken.expiresAt),
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Failed to refresh' }, { status: 500 });
  }
}


