import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const result = await shopifyClient.customerAccessTokenCreate({ email, password });
    if (result.customerUserErrors?.length || !result.customerAccessToken) {
      return NextResponse.json({ error: result.customerUserErrors?.[0]?.message || 'Login failed' }, { status: 401 });
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
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}


