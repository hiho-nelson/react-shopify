import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const result = await shopifyClient.customerRecover(email);
    if (result.customerUserErrors?.length) {
      return NextResponse.json({ error: result.customerUserErrors[0]?.message || 'Recover failed' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to recover' }, { status: 500 });
  }
}


