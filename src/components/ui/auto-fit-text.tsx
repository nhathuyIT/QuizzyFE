"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

interface AutoFitTextProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  lineHeight?: number;
  maxFontSize?: number;
  minFontSize?: number;
}

export function AutoFitText({
  children,
  className,
  containerClassName,
  lineHeight = 1.16,
  maxFontSize = 54,
  minFontSize = 18,
}: AutoFitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  const fitText = useCallback(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const availableWidth = container.clientWidth;
    const availableHeight = container.clientHeight;
    if (!availableWidth || !availableHeight) return;

    const minSize = Math.min(minFontSize, maxFontSize);
    const maxSize = Math.max(minFontSize, maxFontSize);
    let low = minSize;
    let high = maxSize;
    let best = minSize;

    for (let index = 0; index < 14; index += 1) {
      const mid = (low + high) / 2;
      text.style.fontSize = `${mid}px`;
      text.style.lineHeight = String(lineHeight);

      const fits =
        text.scrollWidth <= availableWidth + 1 &&
        text.scrollHeight <= availableHeight + 1;

      if (fits) {
        best = mid;
        low = mid;
      } else {
        high = mid;
      }
    }

    const nextSize = Math.floor(best * 10) / 10;
    setFontSize((currentSize) =>
      Math.abs(currentSize - nextSize) > 0.2 ? nextSize : currentSize,
    );
  }, [lineHeight, maxFontSize, minFontSize]);

  useLayoutEffect(() => {
    fitText();
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => fitText())
        : null;

    resizeObserver?.observe(container);
    window.addEventListener("resize", fitText);
    void document.fonts?.ready.then(() => fitText());

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", fitText);
    };
  }, [fitText]);

  return (
    <span
      className={cn(
        "flex min-h-0 w-full flex-1 items-center justify-center",
        containerClassName,
      )}
      ref={containerRef}
    >
      <span
        className={cn(
          "block max-h-full max-w-full whitespace-pre-wrap break-words text-center [overflow-wrap:anywhere]",
          className,
        )}
        ref={textRef}
        style={{ fontSize, lineHeight }}
      >
        {children}
      </span>
    </span>
  );
}
