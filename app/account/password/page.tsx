'use client';

import { useState } from 'react';

export default function PasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.error || 'Failed');
      setMsg('Password updated');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Change password</h1>
        <form onSubmit={onSubmit} className="bg-white rounded shadow p-4 space-y-3">
          {msg && <div className="text-sm">{msg}</div>}
          <div>
            <label className="block text-sm text-gray-600 mb-1">New password</label>
            <input className="w-full border rounded p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading ? 'Updating...' : 'Update password'}</button>
        </form>
      </div>
    </div>
  );
}


