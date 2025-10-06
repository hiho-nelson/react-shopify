'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/account/profile');
        const data = await res.json();
        setCustomer(data.customer);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          acceptsMarketing: customer.acceptsMarketing,
        }),
      });
      alert('Saved');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">You are not signed in</h1>
          <a href="/account/login" className="underline">Go to login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <form onSubmit={onSave} className="bg-white rounded shadow p-4 space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="w-full border rounded p-2" value={customer.email || ''} onChange={e => setCustomer({ ...customer, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">First name</label>
              <input className="w-full border rounded p-2" value={customer.firstName || ''} onChange={e => setCustomer({ ...customer, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last name</label>
              <input className="w-full border rounded p-2" value={customer.lastName || ''} onChange={e => setCustomer({ ...customer, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input className="w-full border rounded p-2" value={customer.phone || ''} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input id="marketing" type="checkbox" checked={!!customer.acceptsMarketing} onChange={e => setCustomer({ ...customer, acceptsMarketing: e.target.checked })} />
            <label htmlFor="marketing" className="text-sm">Accept marketing</label>
          </div>
          <button disabled={saving} className="px-4 py-2 bg-black text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
}


