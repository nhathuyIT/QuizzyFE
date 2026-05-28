"use client";

import { useEffect, useRef, useState } from "react";
import { throttle } from "@/lib/utils/helpers";

interface UseScrollProgressOptions {
  threshold?: number;
}

export function useScrollProgress(threshold = 0.6) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
      setIsVisible(scrolled > window.innerHeight * threshold);
    }, 50);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { isVisible, progress };
}
