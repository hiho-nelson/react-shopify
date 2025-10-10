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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto mb-6"></div>
          <h2 className="text-2xl font-light text-gray-600">Loading your account...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-600 mb-8">Please sign in to access your account</p>
          <a href="/account/login" className="inline-block bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-thin text-gray-900 mb-2">My Account</h1>
              <p className="text-xl text-gray-600">Welcome back, {profile.firstName || 'there'}</p>
            </div>
            <button 
              onClick={signOut} 
              className="px-6 py-3 bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-white p-2 shadow-sm">
            <button 
              className={`px-6 py-4 text-lg font-medium transition-all duration-200 ${
                tab==='overview' 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`} 
              onClick={()=>setTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-6 py-4 text-lg font-medium transition-all duration-200 ${
                tab==='profile' 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`} 
              onClick={()=>setTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`px-6 py-4 text-lg font-medium transition-all duration-200 ${
                tab==='orders' 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`} 
              onClick={()=>setTab('orders')}
            >
              Orders
            </button>
            <button 
              className={`px-6 py-4 text-lg font-medium transition-all duration-200 ${
                tab==='password' 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`} 
              onClick={()=>setTab('password')}
            >
              Security
            </button>
          </div>
        </div>

        {tab==='overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Card */}
            <div className="bg-white shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-light text-gray-900">Profile Information</h3>
                  <p className="text-gray-600">Your account details</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Email Address</div>
                  <div className="text-xl text-gray-900">{profile.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Full Name</div>
                  <div className="text-xl text-gray-900">
                    {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Not provided'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Phone Number</div>
                  <div className="text-xl text-gray-900">{profile.phone || 'Not provided'}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-light text-gray-900">Quick Actions</h3>
                  <p className="text-gray-600">Manage your account</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={()=>setTab('profile')}
                  className="w-full text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-gray-900 group-hover:text-gray-700">Edit Profile</div>
                      <div className="text-sm text-gray-600">Update your personal information</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button 
                  onClick={()=>setTab('orders')}
                  className="w-full text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-gray-900 group-hover:text-gray-700">View Orders</div>
                      <div className="text-sm text-gray-600">Track your order history</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button 
                  onClick={()=>setTab('password')}
                  className="w-full text-left p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-medium text-gray-900 group-hover:text-gray-700">Security Settings</div>
                      <div className="text-sm text-gray-600">Change your password</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {tab==='profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-2">Edit Profile</h2>
                <p className="text-lg text-gray-600">Update your personal information and preferences</p>
              </div>
              
              <form onSubmit={saveProfile} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
                  <input 
                    className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                    value={profile.email || ''} 
                    onChange={e=>setProfile({ ...profile, email: e.target.value })} 
                    type="email"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">First Name</label>
                    <input 
                      className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                      value={profile.firstName || ''} 
                      onChange={e=>setProfile({ ...profile, firstName: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Last Name</label>
                    <input 
                      className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                      value={profile.lastName || ''} 
                      onChange={e=>setProfile({ ...profile, lastName: e.target.value })} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
                  <input 
                    className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                    value={profile.phone || ''} 
                    onChange={e=>setProfile({ ...profile, phone: e.target.value })} 
                    type="tel"
                  />
                </div>
                
                <div className="flex items-center p-6 bg-gray-50">
                  <input 
                    id="marketing" 
                    type="checkbox" 
                    checked={!!profile.acceptsMarketing} 
                    onChange={e=>setProfile({ ...profile, acceptsMarketing: e.target.checked })}
                    className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                  />
                  <label htmlFor="marketing" className="ml-3 text-lg text-gray-700">
                    I would like to receive marketing emails and updates
                  </label>
                </div>
                
                <div className="flex justify-end pt-6">
                  <button 
                    disabled={saving} 
                    className="px-8 py-4 bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {tab==='orders' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-light text-gray-900 mb-2">Order History</h2>
              <p className="text-lg text-gray-600">Track and manage your orders</p>
            </div>
            
            {orders.length===0 ? (
              <div className="bg-white shadow-lg p-12 text-center border border-gray-100">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-2">No orders yet</h3>
                <p className="text-lg text-gray-600 mb-8">When you place your first order, it will appear here</p>
                <a href="/products" className="inline-block bg-gray-900 text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors">
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((o:any)=>(
                  <div key={o.id} className="bg-white shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                      <div className="mb-4 lg:mb-0">
                        <h3 className="text-2xl font-light text-gray-900 mb-2">
                          {o.name || `Order #${o.orderNumber}`}
                        </h3>
                        <p className="text-lg text-gray-600">
                          Placed on {new Date(o.processedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-light text-gray-900 mb-2">
                          {o.currentTotalPriceSet?.shopMoney?.currencyCode} {parseFloat(o.currentTotalPriceSet?.shopMoney?.amount || '0').toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Total Amount</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fulfillment Status</div>
                        <div className="text-xl font-medium text-gray-900">
                          {o.fulfillmentStatus || 'Processing'}
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Status</div>
                        <div className="text-xl font-medium text-gray-900">
                          {o.financialStatus || 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==='password' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg p-8 border border-gray-100">
              <div className="mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-2">Security Settings</h2>
                <p className="text-lg text-gray-600">Update your password to keep your account secure</p>
              </div>
              
              <form onSubmit={changePassword} className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">New Password</label>
                  <input 
                    className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                    type="password" 
                    value={newPassword} 
                    onChange={e=>setNewPassword(e.target.value)} 
                    required 
                    placeholder="Enter your new password"
                  />
                  <p className="text-sm text-gray-500 mt-2">Password must be at least 8 characters long</p>
                </div>
                
                <div className="p-6 bg-blue-50 border border-blue-200">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-lg font-medium text-blue-900 mb-1">Password Requirements</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Mix of letters, numbers, and symbols</li>
                        <li>• Avoid common words or personal information</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6">
                  <button 
                    className="px-8 py-4 bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



