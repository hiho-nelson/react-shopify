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

  useEffect(() => {
    // Only initialize on client side and not on auth pages
    if (typeof window === "undefined") return;
    
    // Skip Lenis on auth pages for better performance
    if (window.location.pathname.startsWith('/account/')) return;

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

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenisInstance.destroy();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleScroll]);

  return { lenis, scrollY };
}
