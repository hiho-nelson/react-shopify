'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Search, Loader2 } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  // Focus input when modal opens and handle animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    if (query.trim().length < 2) {
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setShowSuggestions(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&first=8`);
        const data = await response.json();
        setResults(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay the actual close to allow animation to complete
    setTimeout(() => {
      setQuery('');
      setResults([]);
      setShowSuggestions(false);
      onClose();
    }, 200);
  };

  const handleResultClick = () => {
    handleClose();
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount)).replace('NZ', '');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        style={{
          backdropFilter: isVisible ? 'blur(5px)' : 'blur(0px)',
          transition: 'backdrop-filter 500ms ease-out'
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl bg-white shadow-xl transition-all duration-300 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Searching...</span>
            </div>
          )}

          {!loading && query.trim().length > 0 && query.trim().length < 2 && (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">Type at least 2 characters to search</span>
            </div>
          )}

          {!loading && showSuggestions && results.length === 0 && query.trim().length >= 2 && (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">No products found</span>
            </div>
          )}

          {!loading && showSuggestions && results.length > 0 && (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-medium text-gray-900 mb-1 capitalize">
                      {product.title}
                    </h3>
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="text-sm text-gray-500 line-clamp-2 w-2/3 ">
                        {product.description?.replace(/<[^>]*>/g, '').substring(0, 100).charAt(0).toUpperCase() + product.description?.replace(/<[^>]*>/g, '').substring(1, 100)}
                        {product.description && product.description.length > 100 && '...'}
                      </p>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-[18px] font-thin text-gray-900">
                          {formatPrice(product.price.amount, product.price.currencyCode)}
                        </span>
                        {!product.availableForSale && (
                          <span className="text-xs text-red-500">Out of stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && query.trim().length === 0 && (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">Start typing to search products</span>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && showSuggestions && results.length > 0 && (
          <div className="border-t p-3">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={handleClose}
              className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all results for "{query}"
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
