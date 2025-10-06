'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export function CartPageContent() {
  const { cart, loading, error, updateQuantity, removeItem, clearCart } = useCartStore();

  // 若有错误，可在此处渲染轻量提示，当前直接继续展示购物车状态

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车商品列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-6">
                  {cart.lines.map((line) => (
                    <div key={line.id} className="flex gap-4 p-4 border rounded-lg">
                      {/* 产品图片 */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {line.merchandise.product.images[0] ? (
                          <Image
                            src={line.merchandise.product.images[0].url}
                            alt={line.merchandise.product.images[0].altText || line.merchandise.product.title}
                            fill
                            className="object-cover rounded"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* 产品信息 */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/products/${line.merchandise.product.handle}`}
                          className="font-medium text-lg hover:underline line-clamp-2"
                        >
                          {line.merchandise.product.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {line.merchandise.title}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          {line.cost.totalAmount.currencyCode} {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                        </p>
                      </div>

                      {/* 数量控制和删除 */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                            disabled={loading}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{line.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeItem(line.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {cart.cost.totalAmount.currencyCode} {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>
                      {cart.cost.totalAmount.currencyCode} {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!cart.checkoutUrl}
                  onClick={() => {
                    if (!cart.checkoutUrl) return;
                    window.location.href = cart.checkoutUrl;
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearCart}
                  disabled={loading}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
