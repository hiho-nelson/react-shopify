import { NextRequest, NextResponse } from 'next/server';

const OIDC_STATE_COOKIE = 'oidc_state';
const SESSION_COOKIE = 'customerAccessToken';

export async function GET(request: NextRequest) {
  const tokenUrl = process.env.SHOPIFY_OIDC_TOKEN_URL; // e.g. https://shopify.com/identity/oauth/token
  const clientId = process.env.SHOPIFY_OIDC_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_OIDC_CLIENT_SECRET;
  const redirectUri = process.env.SHOPIFY_OIDC_REDIRECT_URI;

  if (!tokenUrl || !clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'OIDC is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const cookieState = request.cookies.get(OIDC_STATE_COOKIE)?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.json({ error: 'Invalid OIDC state' }, { status: 400 });
  }

  // Exchange code for tokens at Shopify Identity (example; exact fields depend on Shopify OIDC docs)
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('client_id', clientId);
  body.set('client_secret', clientSecret);
  body.set('redirect_uri', redirectUri);
  body.set('code', code);

  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'OIDC token exchange failed' }, { status: 401 });
  }
  const tokenJson = await tokenRes.json();

  // tokenJson 应包含 id_token / access_token；
  // 在 New Customer Accounts 下，可用返回的会话/用户信息创建你站点的会话。
  // 这里演示：设置 HttpOnly 会话 Cookie（占位，与 Classic token 名字一致，供 Header 复用）
  const res = NextResponse.redirect('/account');
  res.cookies.delete(OIDC_STATE_COOKIE);
  if (tokenJson?.access_token) {
    // 生产中请使用你站点自有会话（不要透传 Shopify 令牌给客户端）
    res.cookies.set(SESSION_COOKIE, tokenJson.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
  }
  return res;
}


