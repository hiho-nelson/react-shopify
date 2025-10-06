import { NextRequest, NextResponse } from 'next/server';

const OIDC_STATE_COOKIE = 'oidc_state';

export async function GET(request: NextRequest) {
  const authUrl = process.env.SHOPIFY_OIDC_AUTH_URL; // e.g. https://shopify.com/identity/oauth/authorize
  const clientId = process.env.SHOPIFY_OIDC_CLIENT_ID;
  const redirectUri = process.env.SHOPIFY_OIDC_REDIRECT_URI; // e.g. https://yourapp.com/api/auth/oidc/callback
  const scope = process.env.SHOPIFY_OIDC_SCOPE || 'openid email profile';

  if (!authUrl || !clientId || !redirectUri) {
    return NextResponse.json({ error: 'OIDC is not configured' }, { status: 500 });
  }

  const state = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

  const url = new URL(authUrl);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  const res = NextResponse.redirect(url.toString());
  res.cookies.set(OIDC_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });
  return res;
}


