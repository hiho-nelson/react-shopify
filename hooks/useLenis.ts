import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    const lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Listen to Lenis scroll events
    lenisInstance.on('scroll', ({ scroll }) => {
      setScrollY(scroll);
    });

    // Use Lenis's built-in RAF handling for better performance
    const raf = (time: number) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

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
      lenisInstance.destroy();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return { lenis, scrollY };
}
