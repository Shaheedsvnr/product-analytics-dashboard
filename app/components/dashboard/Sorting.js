"use client";

/**
 * Sorting Component
 * -----------------
 * Handles product sorting with strict whitelist validation to ensure
 * only allowed sort options are applied.
 *
 * Security:
 * - Uses controlled input (select dropdown)
 * - Validates sort values using whitelist to prevent invalid state injection
 * - No unsafe rendering or DOM manipulation (XSS-safe by design)
 *
 * Best Practices:
 * - Prevents redundant state updates
 * - Uses memoized callbacks for performance
 * - Keeps UI and store state in sync
 */

import { useCallback } from "react";
import { useProductStore } from "@/app/store/useProductStore";

export default function Sorting() {
  const sortBy = useProductStore((state) => state.filters.sortBy);
  const setFilters = useProductStore((state) => state.setFilters);

  const handleSortChange = useCallback(
    (e) => {
      const value = e.target.value;

      if (value === sortBy) return;

      const allowedSorts = ["", "priceLow", "priceHigh", "rating"];
      if (!allowedSorts.includes(value)) return;

      setFilters({ sortBy: value });
    },
    [setFilters, sortBy],
  );

  const handleReset = useCallback(() => {
    if (!sortBy) return;
    setFilters({ sortBy: "" });
  }, [setFilters, sortBy]);

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Sort by
        </h2>

        {sortBy && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Select */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="block w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="">Recommended</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="rating">Rating: High → Low</option>
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>

      <p className="text-[11px] text-slate-400">
        Sorting is applied on top of your current filters.
      </p>
    </div>
  );
}
