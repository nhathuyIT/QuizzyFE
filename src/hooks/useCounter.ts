"use client";

import { useCallback, useRef, useState } from "react";

interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
}

export function useCounter({
  initialValue = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
}: UseCounterOptions = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(
    (by = 1) => setCount((c) => Math.min(c + by, max)),
    [max]
  );

  const decrement = useCallback(
    (by = 1) => setCount((c) => Math.max(c - by, min)),
    [min]
  );

  const reset = useCallback(
    (value?: number) => setCount(value ?? initialValue),
    [initialValue]
  );

  const set = useCallback((value: number) => setCount(Math.min(Math.max(value, min), max)), [min, max]);

  return { count, increment, decrement, reset, set };
}
