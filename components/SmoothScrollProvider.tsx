"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    lenisRef.current = new Lenis({
      duration: 1.0, // Slightly faster for better responsiveness
      easing: (t) => 1 - Math.pow(1 - t, 3), // Cubic ease-out for smoother feel
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 0.8, // Reduced for better control
      smoothTouch: false, // Disabled for better mobile performance
      touchMultiplier: 1.5, // Reduced for better mobile performance
      infinite: false,
      // Performance optimizations
      normalizeWheel: true,
      wheelMultiplier: 1,
      // Disable on low-end devices
      autoRaf: true,
      rafPriority: 0,
    });

    // Optimized RAF loop with performance checks
    let rafId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function raf(time: number) {
      if (time - lastTime >= frameInterval) {
        lenisRef.current?.raf(time);
        lastTime = time;
      }
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Pause on visibility change for better performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenisRef.current?.stop();
      } else {
        lenisRef.current?.start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pause on window blur for better performance
    const handleBlur = () => lenisRef.current?.stop();
    const handleFocus = () => lenisRef.current?.start();

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenisRef.current?.destroy();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return <>{children}</>;
}
