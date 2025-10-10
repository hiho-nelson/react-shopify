'use client';

import { useState, useCallback, useRef } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
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
      window.location.replace('/account/login');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [email, password, firstName, lastName, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-thin text-gray-900 mb-2">Create Account</h1>
          <p className="text-lg text-gray-600">Join us and start shopping</p>
        </div>
        
        <form ref={formRef} onSubmit={onSubmit} className="bg-white shadow-lg p-8 border border-gray-100">
          {error && (
            <div className="text-red-600 text-sm mb-6 p-4 bg-red-50 border border-red-200">
              {error}
            </div>
          )}
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">First Name</label>
                <input 
                  className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Last Name</label>
                <input 
                  className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
              <input 
                className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="john@example.com"
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Password</label>
              <input 
                className="w-full px-4 py-4 border border-gray-300 text-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Create a strong password"
                required 
              />
              <p className="text-sm text-gray-500 mt-2">Password must be at least 8 characters long</p>
            </div>
          </div>
          
          <button 
            disabled={loading} 
            className="w-full bg-gray-900 text-white py-4 text-lg font-medium mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-gray-800"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account? 
              <a href="/account/login" className="text-gray-900 font-medium hover:underline ml-1">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}


