'use client';

import { useState, useCallback, useRef } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Memoize the submit handler to prevent unnecessary re-renders
  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
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
      
      // Use replace instead of href for better performance
      window.location.replace('/account');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, loading]);

  // Memoize input handlers to prevent unnecessary re-renders
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 auth-page">
      <form ref={formRef} onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow auth-form">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && (
          <div className="text-red-600 text-sm mb-3 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black focus:border-transparent transition-colors auth-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-black focus:border-transparent transition-colors auth-input"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded mt-6 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        
        <div className="text-sm text-gray-600 mt-3 text-center">
          No account? <a href="/account/signup" className="underline hover:text-gray-900">Create one</a>
        </div>
      </form>
    </div>
  );
}


