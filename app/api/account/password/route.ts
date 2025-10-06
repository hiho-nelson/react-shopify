import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    const body = await request.json();
    const { password } = body || {};
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
    // Classic API 没有单独的 changePassword 端点，通常需走 reset 或 update（部分店铺需 currentPassword）。此处用 customerUpdate 尝试。
    const result = await shopifyClient.customerUpdate(token, { password });
    if (result.customerUserErrors?.length) {
      return NextResponse.json({ error: result.customerUserErrors[0]?.message || 'Password update failed' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}


