'use client';

import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/account/orders');
        const data = await res.json();
        setOrders(data.orders?.edges?.map((e: any) => e.node) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <div className="bg-white rounded shadow divide-y">
          {orders.length === 0 && <div className="p-4 text-gray-500">No orders found.</div>}
          {orders.map((o: any) => (
            <div key={o.id} className="p-4">
              <div className="flex justify-between">
                <div className="font-medium">{o.name || `#${o.orderNumber}`}</div>
                <div className="text-sm text-gray-500">{new Date(o.processedAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-gray-600">Status: {o.fulfillmentStatus || '-'} · {o.financialStatus || '-'}</div>
              <div className="text-sm">Total: {o.currentTotalPriceSet?.shopMoney?.currencyCode} {parseFloat(o.currentTotalPriceSet?.shopMoney?.amount || '0').toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


