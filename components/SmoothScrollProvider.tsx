"use client";

import { useLenis } from "@/hooks/useLenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Initialize Lenis through the hook
  useLenis();

  return <>{children}</>;
}
