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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-thin text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-lg text-gray-600">Sign in to your account</p>
        </div>
        
        <form ref={formRef} onSubmit={onSubmit} className="bg-white shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="text-red-600 text-sm mb-6 p-4 bg-red-50 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">
                Email Address
              </label>
              <input
                id="email"
                className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">
                Password
              </label>
              <input
                id="password"
                className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 text-lg font-medium mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-gray-800"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account? 
              <a href="/account/signup" className="text-gray-900 font-medium hover:underline ml-1">
                Create one
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


