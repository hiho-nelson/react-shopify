'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { ArrowLeft, Lock, CreditCard, Shield } from 'lucide-react';

export function CheckoutPageContent() {
  const { cart, loading } = useCartStore();
  const [clientReady, setClientReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady) return;
    if (!loading && (!cart || cart.lines.length === 0)) {
      window.location.href = '/cart';
    }
  }, [clientReady, cart, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!cart) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Checkout functionality would redirect to Shopify Checkout here!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!clientReady || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No items in cart</h1>
          <Link href="/cart">
            <Button>Return to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Payment will be processed securely by Shopify</p>
                <p className="text-sm mt-2">You'll be redirected to Shopify's secure checkout</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      {line.merchandise.product.images[0] ? (
                        <Image src={line.merchandise.product.images[0].url} alt={line.merchandise.product.images[0].altText || line.merchandise.product.title} fill className="object-cover rounded" sizes="64px" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-2">{line.merchandise.product.title}</p>
                      <p className="text-xs text-gray-500">{line.merchandise.title}</p>
                      <p className="text-sm text-gray-500">Qty: {line.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {line.cost.totalAmount.currencyCode} {parseFloat(line.cost.totalAmount.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    {cart.cost.totalAmount.currencyCode} {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" onClick={handleCheckout} disabled={isProcessing || !formData.email}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


