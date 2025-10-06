'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';

export function Header() {
  const { cart, toggleCart } = useCartStore();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (!ignore) setCustomerEmail(data?.customer?.email || null);
      } catch {
        if (!ignore) setCustomerEmail(null);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCustomerEmail(null);
      window.location.href = '/';
    } catch {
      // ignore
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      setMenuVisible(true);
      setMenuEntered(false);
      const t = setTimeout(() => setMenuEntered(true), 20);
      return () => clearTimeout(t);
    }
    setMenuEntered(false);
    const t2 = setTimeout(() => setMenuVisible(false), 300);
    return () => clearTimeout(t2);
  }, [mobileOpen]);

  // Desktop mega menu
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaVisible, setMegaVisible] = useState(false);
  const [megaEntered, setMegaEntered] = useState(false);
  let megaTimer: number | undefined;
  const { collections } = useCollections(12);

  const openMega = () => {
    window.clearTimeout(megaTimer);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer = window.setTimeout(() => setMegaOpen(false), 100);
  };

  useEffect(() => {
    if (megaOpen) {
      setMegaVisible(true);
      setMegaEntered(false);
      const t = setTimeout(() => setMegaEntered(true), 20);
      return () => clearTimeout(t);
    }
    setMegaEntered(false);
    const t2 = setTimeout(() => setMegaVisible(false), 200);
    return () => clearTimeout(t2);
  }, [megaOpen]);

  return (
    <header className="bg-white shadow-sm border-b relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Shopify Store</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 relative">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Home</span>
            </Link>
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${megaOpen ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              onMouseEnter={openMega}
              onFocus={openMega}
              onMouseLeave={closeMega}
              aria-haspopup="true"
              aria-expanded={megaOpen}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Shop</span>
            </button>
            <Link 
              href="/collections" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Collections</span>
            </Link>

            {/* Mega panel */}
            {megaVisible && (
              <div
                className={`fixed left-0 right-0 top-16 z-40 bg-white border-t border-b transition-opacity duration-200 ${megaEntered ? 'opacity-100' : 'opacity-0'}`}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 transform transition-transform duration-200 ${megaEntered ? 'translate-y-0' : 'translate-y-2'}`}>
                  <div className="w-full grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                      <div className="text-xs uppercase tracking-wide text-gray-500 mb-3">Featured</div>
                      <ul className="space-y-2">
                        <li><Link href="/products" className="block text-gray-800 hover:text-blue-600"><span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">All Products</span></Link></li>
                        <li><Link href="/collections" className="block text-gray-800 hover:text-blue-600"><span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">All Collections</span></Link></li>
                      </ul>
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-6">
                      {collections.map((c) => (
                        <div key={c.id}>
                          <Link href={`/collections`} className="font-medium text-gray-900 hover:text-blue-600">
                            <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">{c.title}</span>
                          </Link>
                          {c.products?.length ? (
                            <ul className="mt-2 space-y-1">
                              {c.products.slice(0, 4).map((p) => (
                                <li key={p.id}>
                                  <Link href={`/products/${p.handle}`} className="text-sm text-gray-700 hover:text-blue-600">
                                    <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">{p.title}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden h-9 w-9 grid place-items-center rounded hover:bg-gray-100"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Cart ({cart?.totalQuantity || 0})
            </Button>
            {customerEmail ? (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/account">Account</Link>
                </Button>
                <Button size="sm" onClick={signOut}>Sign Out</Button>
              </div>
            ) : (
              <Button size="sm" asChild>
                <Link href="/account/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Mobile drawer & overlay */}
      {menuVisible && (
        <>
          <div 
            className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${menuEntered ? 'opacity-100 bg-black/40' : 'opacity-0 bg-black/40'}`}
            onClick={() => setMobileOpen(false)}
          />
          <div className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85%] bg-white shadow-xl transform transition-transform duration-300 ease-out ${menuEntered ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button className="h-9 w-9 grid place-items-center rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col py-2">
              <Link href="/" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/products" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Products</Link>
              <Link href="/collections" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Collections</Link>
              {customerEmail ? (
                <>
                  <Link href="/account" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Account</Link>
                  <button className="text-left px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => { setMobileOpen(false); signOut(); }}>Sign Out</button>
                </>
              ) : (
                <Link href="/account/login" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
