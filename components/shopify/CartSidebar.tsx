'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export function CartSidebar() {
  const { cart, loading, isOpen, updateQuantity, removeItem, closeCart } = useCartStore();

  // 控制开合过渡（保持挂载以实现退出动画）
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setEntered(false);
      const timerIn = setTimeout(() => setEntered(true), 20); // 延时触发以确保过渡
      return () => clearTimeout(timerIn);
    }
    setEntered(false);
    const timerOut = setTimeout(() => setVisible(false), 300); // 与侧边栏 duration-300 对齐
    return () => clearTimeout(timerOut);
  }, [isOpen]);

  const handleClose = () => {
    setEntered(false);
    setTimeout(() => closeCart(), 300);
  };

  if (!visible) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${entered ? 'opacity-100 bg-black/40' : 'opacity-0 bg-black/40'}`}
        onClick={handleClose}
      />
      
      {/* 侧边栏 */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${entered ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({cart?.totalQuantity || 0})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* 购物车内容 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : cart?.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <ShoppingBag className="h-12 w-12 mb-2" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart?.lines.map((line) => (
                <div key={line.id} className="flex gap-5 p-3">
                  {/* 产品图片 */}
                  <div className="relative w-36 h-24 flex-shrink-0">
                    {line.merchandise.product.images[0] ? (
                      <Image
                        src={line.merchandise.product.images[0].url}
                        alt={line.merchandise.product.images[0].altText || line.merchandise.product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* 产品信息 */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <Link 
                      href={`/products/${line.merchandise.product.handle}`}
                      onClick={closeCart}
                      className="font-thin text-2xl capitalize hover:underline line-clamp-2"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {line.merchandise.title}
                    </p>
                    <p className="text-lg font-medium mt-1">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: line.cost.totalAmount.currencyCode, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2 }).format(parseFloat(line.cost.totalAmount.amount))}
                    </p>
                  </div>

                  {/* 数量控制 */}
                  <div className="flex flex-col items-end gap-2 justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                        disabled={loading}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        disabled={loading}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-[#b8bca5]"
                      onClick={() => removeItem(line.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部 */}
        {cart && cart.lines.length > 0 && (
          <div className="p-4 space-y-4">
            {/* 总价 */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.cost.totalAmount.currencyCode, currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2 }).format(parseFloat(cart.cost.totalAmount.amount))}
              </span>
            </div>

            {/* 按钮 */}
            <div className="space-y-2">
              <Button 
                className="w-full rounded-none h-12" 
                disabled={!cart?.checkoutUrl}
                onClick={() => {
                  if (!cart?.checkoutUrl) return;
                  closeCart();
                  window.location.href = cart.checkoutUrl;
                }}
              >
                Checkout
              </Button>
              {/* <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  closeCart();
                  window.location.href = '/cart';
                }}
              >
                View Cart
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
