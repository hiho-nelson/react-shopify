import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

export async function POST(request: NextRequest) {
  try {
    const { id, resetToken, password } = await request.json();
    if (!id || !resetToken || !password) return NextResponse.json({ error: 'id, resetToken, password required' }, { status: 400 });
    const result = await shopifyClient.customerReset(id, resetToken, password);
    if (result.customerUserErrors?.length) {
      return NextResponse.json({ error: result.customerUserErrors[0]?.message || 'Reset failed' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to reset' }, { status: 500 });
  }
}


