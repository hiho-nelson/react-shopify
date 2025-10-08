"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize on client side
    if (typeof window === "undefined") return;

    lenisRef.current = new Lenis({
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false,
      wheelMultiplier: 1,
    });

    // Use Lenis's built-in RAF handling for better performance
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

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
      lenisRef.current?.destroy();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return <>{children}</>;
}
