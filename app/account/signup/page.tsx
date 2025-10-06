'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      // 提示去邮箱激活（Shopify 会发送激活邮件）
      alert('Signup successful. Please check your email to activate your account.');
      window.location.href = '/account/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <label className="block text-sm font-medium mb-1">First name</label>
        <input className="w-full border rounded p-2 mb-3" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <label className="block text-sm font-medium mb-1">Last name</label>
        <input className="w-full border rounded p-2 mb-3" value={lastName} onChange={e => setLastName(e.target.value)} />
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border rounded p-2 mb-3" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input className="w-full border rounded p-2 mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  );
}


