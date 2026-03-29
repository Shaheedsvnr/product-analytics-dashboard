"use client";

/**
 * Filters Component
 * -----------------
 * Handles advanced product filtering including category, rating, and price range.
 *
 * Security:
 * - Uses strict whitelist validation for categories
 * - Validates numeric inputs for rating and price range
 * - Prevents invalid state updates through defensive checks
 * - No unsafe rendering or DOM manipulation (XSS-safe by design)
 *
 * Performance:
 * - Uses memoization (useMemo) for derived computations (category counts, max price)
 * - Uses useCallback to prevent unnecessary re-renders
 * - Efficient state updates via centralized store (Zustand)
 *
 * Architecture:
 * - Separates UI from state management (store-driven filters)
 * - Computes derived state locally for performance optimization
 */

import { useMemo, useCallback } from "react";
import { useProductStore } from "@/app/store/useProductStore";

const categories = Object.freeze([
  "Electronics",
  "Clothing",
  "Home",
  "Sports",
  "Books",
]);

const EMPTY_OBJ = Object.freeze({});

export default function Filters() {
  const filters = useProductStore((s) => s.filters);
  const setFilters = useProductStore((s) => s.setFilters);
  const products = useProductStore((s) => s.products);
  const clearFilters = useProductStore((s) => s.clearFilters);

  const categoryCounts = useMemo(() => {
    if (!products) return EMPTY_OBJ;

    const counts = Object.create(null);

    for (let i = 0; i < products.length; i++) {
      const cat = products[i].category;
      counts[cat] = (counts[cat] || 0) + 1;
    }

    return counts;
  }, [products]);

  const selectedSet = useMemo(
    () => new Set(filters.categories || []),
    [filters.categories],
  );

  const maxPrice = useMemo(() => {
    if (!products?.length) return 0;

    let max = 0;
    for (let i = 0; i < products.length; i++) {
      if (products[i].price > max) max = products[i].price;
    }

    return max;
  }, [products]);

  const safeMaxPrice = maxPrice || 5000;

  const handleCategoryChange = useCallback(
    (category) => {
      if (!category || typeof category !== "string") return;
      if (!categories.includes(category)) return;

      const current = filters.categories || [];
      const exists = selectedSet.has(category);

      const updated = exists
        ? current.filter((c) => c !== category)
        : [...current, category];

      setFilters({ categories: updated });
    },
    [selectedSet, setFilters],
  );

  const handleRatingChange = useCallback(
    (value) => {
      const num = Number(value);
      if (isNaN(num) || num < 0 || num > 5) return;

      setFilters({ rating: num });
    },
    [setFilters],
  );

  const handleClearAll = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const updatePriceRange = useCallback(
    (min, max) => {
      const current = filters.priceRange ?? [0, safeMaxPrice];

      if (current[0] !== min || current[1] !== max) {
        setFilters({ priceRange: [min, max] });
      }
    },
    [filters.priceRange, safeMaxPrice, setFilters],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Category Filters
        </h2>

        <button
          type="button"
          onClick={handleClearAll}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <section>
        <div className="grid grid-cols-1 gap-2">
          {categories.map((cat) => {
            const selected = selectedSet.has(cat);
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={[
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition-all gap-2 cursor-pointer",
                  "hover:border-indigo-300 hover:bg-indigo-50/60",
                  selected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-[0_0_0_1px_rgba(79,70,229,0.25)]"
                    : "border-slate-200 bg-slate-50/60 text-slate-600",
                ].join(" ")}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex h-4 w-4 items-center justify-center rounded border text-[10px] font-semibold",
                      selected
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-slate-300 bg-white text-transparent",
                    ].join(" ")}
                  >
                    ✓
                  </span>

                  <span className="truncate">{cat}</span>
                </span>

                <span className="text-[11px] font-medium text-slate-400">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Rating */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-2">
          Rating
        </p>

        <select
          value={filters.rating}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value={0}>All ratings</option>
          <option value={1}>1★ & up</option>
          <option value={2}>2★ & up</option>
          <option value={3}>3★ & up</option>
          <option value={4}>4★ & up</option>
        </select>
      </section>

      {/* Price Range */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-2">
          Price Range
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>₹{filters.priceRange?.[0] ?? 0}</span>
            <span>₹{safeMaxPrice}</span>
          </div>

          <div className="space-y-2">
            {/* MIN */}
            <input
              type="range"
              min={0}
              max={safeMaxPrice}
              step={50}
              value={filters.priceRange?.[0] ?? 0}
              onChange={(e) => {
                const min = Number(e.target.value);
                const max = filters.priceRange?.[1] ?? safeMaxPrice;

                if (isNaN(min) || min < 0 || min > safeMaxPrice) return;
                if (min > max) return;

                updatePriceRange(min, max);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            {/* MAX */}
            <input
              type="range"
              min={0}
              max={safeMaxPrice}
              step={50}
              value={filters.priceRange?.[1] ?? safeMaxPrice}
              onChange={(e) => {
                const max = Number(e.target.value);
                const min = filters.priceRange?.[0] ?? 0;

                if (isNaN(max) || max < 0 || max > safeMaxPrice) return;
                if (max < min) return;

                updatePriceRange(min, max);
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
