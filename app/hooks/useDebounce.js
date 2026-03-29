"use client";
/**
 * useDebounce Hook
 * -----------------
 * Custom React hook to debounce a fast-changing value.
 *
 * Purpose:
 * - Delays updating the value until after a specified delay
 * - Prevents unnecessary re-renders and expensive operations (search)
 *
 * Features:
 * - Skips initial render update for better UX performance
 * - Clears previous timers to avoid race conditions
 * - Safely handles invalid delay values
 * - Prevents redundant state updates using Object.is check
 *
 * Use Case:
 * - Search inputs
 *
 * Performance:
 * - Reduces render frequency under rapid state changes
 * - Ensures only the latest value is committed after inactivity
 */
import { useEffect, useRef, useState } from "react";

export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const timerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // guard invalid delay
    const safeDelay = typeof delay === "number" && delay >= 0 ? delay : 300;

    // skip first render (prevents unnecessary delay)
    if (!mountedRef.current) {
      mountedRef.current = true;
      setDebouncedValue(value);
      return;
    }

    // clear existing timer before scheduling new one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(
        (prev) => (Object.is(prev, value) ? prev : value), //  prevent useless re-render
      );
    }, safeDelay);

    // cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
