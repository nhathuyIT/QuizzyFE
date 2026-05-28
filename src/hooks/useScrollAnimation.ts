"use client";

import { useEffect } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  staggerDelay?: number;
  visibleClass?: string;
  selector?: string;
  rootMargin?: string;
}

export function useScrollAnimation({
  threshold = 0.12,
  staggerDelay = 80,
  visibleClass = "visible",
  selector = ".fade-up",
  rootMargin,
}: UseScrollAnimationOptions = {}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add(visibleClass),
              i * staggerDelay
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: rootMargin ?? undefined }
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, staggerDelay, visibleClass, selector, rootMargin]);
}
