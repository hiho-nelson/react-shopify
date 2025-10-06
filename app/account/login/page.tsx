'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        return;
      }
      window.location.href = '/account';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <label className="block text-sm font-medium mb-1">Email</label>
        <input className="w-full border rounded p-2 mb-3" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label className="block text-sm font-medium mb-1">Password</label>
        <input className="w-full border rounded p-2 mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        <div className="text-sm text-gray-600 mt-3">
          No account? <a href="/account/signup" className="underline">Create one</a>
        </div>
      </form>
    </div>
  );
}


