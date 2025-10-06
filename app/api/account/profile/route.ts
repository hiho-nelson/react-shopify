import { NextRequest, NextResponse } from 'next/server';
import { shopifyClient } from '@/lib/shopify/client';

const COOKIE_NAME = 'customerAccessToken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ customer: null }, { status: 401 });
    const customer = await shopifyClient.customerProfile(token);
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ customer: null }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    const body = await request.json();
    const { email, firstName, lastName, phone, acceptsMarketing } = body || {};
    const result = await shopifyClient.customerUpdate(token, { email, firstName, lastName, phone, acceptsMarketing });
    if (result.customerUserErrors?.length) {
      return NextResponse.json({ error: result.customerUserErrors[0]?.message || 'Update failed' }, { status: 400 });
    }
    return NextResponse.json({ customer: result.customer });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}


