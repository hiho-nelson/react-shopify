'use client';

import { useEffect, useState } from 'react';

type Customer = {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
};

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Customer | null>(null);
  const [tab, setTab] = useState<'overview'|'profile'|'orders'|'password'>('overview');
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/account/profile');
        if (r.status === 401) {
          setProfile(null);
          return;
        }
        const d = await r.json();
        setProfile(d.customer || null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (tab !== 'orders') return;
    (async () => {
      const r = await fetch('/api/account/orders');
      const d = await r.json();
      setOrders(d.orders?.edges?.map((e: any) => e.node) || []);
    })();
  }, [tab]);

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      alert('Saved');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    const r = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    const d = await r.json();
    if (!r.ok) return alert(d.error || 'Failed');
    setNewPassword('');
    alert('Password updated');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
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
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Account</h1>
          <button onClick={signOut} className="px-3 py-2 bg-black text-white rounded">Sign out</button>
        </div>

        <div className="mb-6 flex gap-3 text-sm">
          <button className={`px-3 py-2 rounded ${tab==='overview'?'bg-black text-white':'bg-white border'}`} onClick={()=>setTab('overview')}>Overview</button>
          <button className={`px-3 py-2 rounded ${tab==='profile'?'bg-black text-white':'bg-white border'}`} onClick={()=>setTab('profile')}>Profile</button>
          <button className={`px-3 py-2 rounded ${tab==='orders'?'bg-black text-white':'bg-white border'}`} onClick={()=>setTab('orders')}>Orders</button>
          <button className={`px-3 py-2 rounded ${tab==='password'?'bg-black text-white':'bg-white border'}`} onClick={()=>setTab('password')}>Password</button>
        </div>

        {tab==='overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-4">
              <div className="text-sm text-gray-600">Email</div>
              <div className="mb-3">{profile.email}</div>
              <div className="text-sm text-gray-600">Name</div>
              <div>{[profile.firstName, profile.lastName].filter(Boolean).join(' ') || '-'}</div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-medium mb-2">Quick links</div>
              <ul className="list-disc list-inside text-sm">
                <li><a className="underline" onClick={()=>setTab('profile')}>Edit profile</a></li>
                <li><a className="underline" onClick={()=>setTab('orders')}>View orders</a></li>
                <li><a className="underline" onClick={()=>setTab('password')}>Change password</a></li>
              </ul>
            </div>
          </div>
        )}

        {tab==='profile' && (
          <form onSubmit={saveProfile} className="bg-white rounded shadow p-4 space-y-3 max-w-xl">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input className="w-full border rounded p-2" value={profile.email || ''} onChange={e=>setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">First name</label>
                <input className="w-full border rounded p-2" value={profile.firstName || ''} onChange={e=>setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Last name</label>
                <input className="w-full border rounded p-2" value={profile.lastName || ''} onChange={e=>setProfile({ ...profile, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input className="w-full border rounded p-2" value={profile.phone || ''} onChange={e=>setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input id="marketing" type="checkbox" checked={!!profile.acceptsMarketing} onChange={e=>setProfile({ ...profile, acceptsMarketing: e.target.checked })} />
              <label htmlFor="marketing" className="text-sm">Accept marketing</label>
            </div>
            <button disabled={saving} className="px-4 py-2 bg-black text-white rounded">{saving ? 'Saving...' : 'Save'}</button>
          </form>
        )}

        {tab==='orders' && (
          <div className="bg-white rounded shadow divide-y">
            {orders.length===0 && <div className="p-4 text-gray-500">No orders found.</div>}
            {orders.map((o:any)=>(
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
        )}

        {tab==='password' && (
          <form onSubmit={changePassword} className="bg-white rounded shadow p-4 space-y-3 max-w-xl">
            <div>
              <label className="block text-sm text-gray-600 mb-1">New password</label>
              <input className="w-full border rounded p-2" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
            </div>
            <button className="px-4 py-2 bg-black text-white rounded">Update password</button>
          </form>
        )}
      </div>
    </div>
  );
}



