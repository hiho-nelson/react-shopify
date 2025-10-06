import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const result = await shopifyClient.customerCreate({ email, password, firstName, lastName });
    if (result.customerUserErrors?.length) {
      return NextResponse.json({ error: result.customerUserErrors[0]?.message || 'Signup error' }, { status: 400 });
    }
    return NextResponse.json({ customer: result.customer });
  } catch {
    return NextResponse.json({ error: 'Failed to signup' }, { status: 500 });
  }
}


