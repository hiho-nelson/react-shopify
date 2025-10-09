import { useEffect, useState, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(({ scroll }: { scroll: number }) => {
    setScrollY(scroll);
  }, []);

  // Fallback scroll handler for mobile devices
  const handleNativeScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Only initialize on client side and not on auth pages
    if (typeof window === "undefined") return;
    
    // Skip Lenis on auth pages for better performance
    if (window.location.pathname.startsWith('/account/')) return;

    // Check if device is mobile (only by user agent, not screen size)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Skip Lenis on mobile devices for better touch performance
    if (isMobileDevice) {
      // Set up native scroll listener for mobile devices
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    const lenisInstance = new Lenis({
      duration: 1.2, // Slightly longer duration for smoother feel
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      wheelMultiplier: 1,
      // Performance optimizations
      lerp: 0.1,
      syncTouch: true,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Listen to Lenis scroll events with throttling
    lenisInstance.on('scroll', handleScroll);

    // Optimized RAF loop with error handling
    const raf = (time: number) => {
      if (lenisInstance) {
        lenisInstance.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
    };
    rafRef.current = requestAnimationFrame(raf);

    // Pause on visibility change for better performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenisInstance.stop();
      } else {
        lenisInstance.start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pause on window blur for better performance
    const handleBlur = () => lenisInstance.stop();
    const handleFocus = () => lenisInstance.start();

    // Handle resize - only stop/start based on actual mobile devices, not screen size
    const handleResize = () => {
      const isMobileDeviceNow = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDeviceNow) {
        lenisInstance.stop();
      } else {
        lenisInstance.start();
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("resize", handleResize);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisInstance.destroy();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll]);

  return { lenis, scrollY };
}
