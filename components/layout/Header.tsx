'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { usePathname } from 'next/navigation';
import { SearchModal } from '@/components/shopify/SearchModal';

export function Header() {
  const { cart, toggleCart } = useCartStore();
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  
  // Robust home header state using IntersectionObserver
  useEffect(() => {
    // Non-home routes are always solid
    if (!isHome) {
      setScrolled(true);
      return;
    }

    // Home route: use an invisible sentinel to detect crossing 300px
    setScrolled(false);

    let observer: IntersectionObserver | null = null;
    let sentinel = document.getElementById('header-sentinel');

    if (!sentinel) {
      sentinel = document.createElement('div');
      sentinel.id = 'header-sentinel';
      // Place the sentinel 300px below the top so crossing it toggles state
      sentinel.style.position = 'absolute';
      sentinel.style.top = '300px';
      sentinel.style.left = '0';
      sentinel.style.width = '1px';
      sentinel.style.height = '1px';
      sentinel.style.pointerEvents = 'none';
      sentinel.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sentinel);
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // When the sentinel is NOT intersecting, we've scrolled past 300px
        setScrolled(!entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(sentinel);

    return () => {
      if (observer) observer.disconnect();
      // Keep the sentinel in the DOM to reuse across navigations
    };
  }, [isHome]);

  // Route change: ensure we start from correct baseline without forcing scroll
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
    } else {
      // On home, baseline is false; IO will update after paint
      setScrolled(false);
    }
  }, [pathname, isHome]);

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

  // Scroll state is now handled by useLenis hook

  // sign out handled within account area; no direct sign out button in header

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

  const solid = !isHome || scrolled;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out ${solid ? 'bg-white shadow-sm border-b' : 'bg-transparent border-none shadow-none'}`}>
      <div className="flex justify-center px-4 sm:px-12">
        <div className={`w-full flex justify-between items-center ${solid ? 'h-20' : 'h-36'} transition-[height] duration-300`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold transition-colors duration-300 ease-in-out ${solid ? 'text-gray-900' : 'text-white'}`}>Christopher Photos</span>
          </Link>

          {/* Right: menu + account/cart */}
          <div className="flex items-center gap-4">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 relative">
            <Link 
              href="#" 
              className={`${solid ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'} px-3 py-2 rounded-md text-base md:text-lg font-light transition-colors duration-300 ease-in-out`}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">About Me</span>
            </Link>
            <button
              type="button"
              className={`px-3 py-2 rounded-md text-base md:text-lg font-light transition-colors duration-300 ease-in-out ${solid ? (megaOpen ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900') : (megaOpen ? 'text-white' : 'text-white/90 hover:text-white')}`}
              onMouseEnter={openMega}
              onFocus={openMega}
              onMouseLeave={closeMega}
              aria-haspopup="true"
              aria-expanded={megaOpen}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Gallery</span>
            </button>
            <Link 
              href="#" 
              className={`${solid ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'} px-3 py-2 rounded-md text-base md:text-lg font-light transition-colors duration-300 ease-in-out`}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Process</span>
            </Link>
            <Link 
              href="#" 
              className={`${solid ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'} px-3 py-2 rounded-md text-base md:text-lg font-light transition-colors duration-300 ease-in-out`}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200">Blog</span>
            </Link>
            <Link 
              href="#" 
              className={`${solid ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'} px-3 py-2 rounded-md text-base md:text-lg font-light transition-colors duration-300 ease-in-out`}
            >
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-current after:w-0 hover:after:w-full after:transition-all after:duration-200 border px-7 py-2" style={{borderColor: solid ? '#6b7280' : 'white'}}>Contact Me</span>
            </Link>

            {/* Mega panel */}
            {megaVisible && (
              <div
                className={`fixed left-0 right-0 ${solid ? 'top-20' : 'top-36'} z-40 transition-opacity duration-200 ${megaEntered ? 'opacity-100' : 'opacity-0'}`}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className="flex justify-center px-12">
                  <div className={`w-full bg-white border-t border-b shadow-lg py-12 transform transition-transform duration-200 ${megaEntered ? 'translate-y-0' : 'translate-y-2'}`}>
                    <div className="px-12">
                      <div className="w-full grid grid-cols-4">
                        {/* Column 1 - NATURE */}
                        <div className="pr-6 border-r border-gray-200">
                          <div className="text-sm font-semibold text-gray-900 mb-4">NATURE</div>
                          <ul className="space-y-3">
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">New Releases</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">The Grand Landscape</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Intimate Scenes</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Wildlife</Link></li>
                          </ul>
                        </div>

                        {/* Column 2 - LIFESTYLE */}
                        <div className="px-6 border-r border-gray-200">
                          <div className="text-sm font-semibold text-gray-900 mb-4">LIFESTYLE</div>
                          <ul className="space-y-3">
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Environmental Portraits</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Companions</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Family</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Love</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Portraits</Link></li>
                          </ul>
                        </div>

                        {/* Column 3 - WEDDINGS */}
                        <div className="px-6 border-r border-gray-200">
                          <div className="text-sm font-semibold text-gray-900 mb-4">WEDDINGS</div>
                          <ul className="space-y-3">
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Elopements</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Weddings</Link></li>
                          </ul>
                        </div>

                        {/* Column 4 - BUSINESS */}
                        <div className="pl-6">
                          <div className="text-sm font-semibold text-gray-900 mb-4">BUSINESS</div>
                          <ul className="space-y-3">
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Commercial</Link></li>
                            <li><Link href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Events</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className={`h-9 w-9 flex items-center justify-center rounded-md transition-colors duration-300 ease-in-out ${solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile hamburger */}
            <button
              type="button"
              className={`md:hidden h-9 w-9 grid place-items-center rounded transition-colors duration-300 ease-in-out ${solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button 
              onClick={toggleCart}
              aria-label="Open cart"
              className={`relative h-9 w-9 flex items-center justify-center rounded-md transition-colors duration-300 ease-in-out ${solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {(cart?.totalQuantity || 0) > 0 && (
                <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full text-[10px] font-medium ${solid ? 'bg-black text-white' : 'bg-white text-black'} h-4 min-w-4 px-1`}>
                  {cart?.totalQuantity}
                </span>
              )}
            </button>
            <Link
              href={customerEmail ? '/account' : '/account/login'}
              aria-label={customerEmail ? 'Account' : 'Sign in'}
              className={`h-9 w-9 flex items-center justify-center rounded-md transition-colors duration-300 ease-in-out ${solid ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
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
              <Link href="#" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>About Me</Link>
              <Link href="#" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Gallery</Link>
              <Link href="#" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Process</Link>
              <Link href="#" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="#" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Contact Me</Link>
              {customerEmail ? (
                <Link href="/account" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Account</Link>
              ) : (
                <Link href="/account/login" className="px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </header>
  );
}
