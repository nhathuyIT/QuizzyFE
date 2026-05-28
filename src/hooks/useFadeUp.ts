"use client";

import { useEffect, useRef } from "react";

interface UseFadeUpOptions {
  threshold?: number;
  delayStep?: number;
  className?: string;
  selector?: string;
}

export function useFadeUp({
  threshold = 0.12,
  delayStep = 80,
  className = "visible",
  selector = ".fade-up",
}: UseFadeUpOptions = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add(className), i * delayStep);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [threshold, delayStep, className, selector]);
}
