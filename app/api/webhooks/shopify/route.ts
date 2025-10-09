import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, admin_graphql_api_id } = body;

    console.log(`🔄 [Webhook] Received ${topic} for product ${admin_graphql_api_id}`);

    // 处理产品相关的事件
    if (topic.includes('products')) {
      // 重新验证 Shopify 相关缓存
      revalidateTag('shopify');
      revalidateTag('products');
      revalidateTag('search');
      
      // 重新验证相关页面
      revalidatePath('/products');
      revalidatePath('/');
      
      // 如果有具体产品ID，也重新验证该产品页面
      if (admin_graphql_api_id) {
        revalidateTag(`product-${admin_graphql_api_id}`);
      }
      
      console.log('✅ [Webhook] Cache revalidated for products');
    }

    // 处理集合相关的事件
    if (topic.includes('collections')) {
      revalidateTag('shopify');
      revalidateTag('collections');
      revalidatePath('/collections');
      console.log('✅ [Webhook] Cache revalidated for collections');
    }

    return NextResponse.json({ success: true, revalidated: true });
  } catch (error) {
    console.error('❌ [Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// 处理其他HTTP方法
export async function GET() {
  return NextResponse.json({ message: 'Shopify webhook endpoint' });
}
