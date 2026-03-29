"use client";
/**
 * useFilteredProducts Hook
 * ------------------------
 * Optimized custom hook for filtering and sorting products from global store state.
 *
 * Responsibilities:
 * - Filters products based on search, category, price range, and rating
 * - Sorts products by selected sort criteria (price, rating, etc.)
 * - Uses React performance optimizations (useMemo + useDeferredValue)
 *
 * Performance Optimizations:
 * - Uses useDeferredValue to prevent UI blocking on fast-changing inputs
 * - Avoids unnecessary recalculations by memoizing filtered and sorted results
 * - Splits filtering and sorting into separate optimized phases
 *
 * Data Flow:
 * store.products + store.filters
 *        ↓
 * deferred inputs (search, sort)
 *        ↓
 * filterProducts()
 *        ↓
 * useDeferredValue (filtered result)
 *        ↓
 * sortProducts()
 *        ↓
 * final sorted product list
 *
 * Use Case:
 * - Product listing pages
 * - filters
 * - UI rendering
 */
import { useMemo, useDeferredValue } from "react";
import { useProductStore } from "@/app/store/useProductStore";

/* ---------------- FILTER ---------------- */
function filterProducts(products, filters) {
  if (!products?.length) return [];

  const search = filters.search ? filters.search.toLowerCase() : "";
  const hasSearch = search.length > 0;

  const categories = filters.categories || [];
  const hasCategory = categories.length > 0;
  const categorySet = hasCategory ? new Set(categories) : null;

  const [min, max] = filters.priceRange || [0, Infinity];
  const minRating = filters.rating || 0;

  const result = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const name = p.nameLower || p.name || "";

    if (p.price < min || p.price > max) continue;
    if (minRating && p.rating < minRating) continue;
    if (hasCategory && !categorySet.has(p.category)) continue;
    if (hasSearch && !name.toLowerCase().includes(search)) continue;

    result.push(p);
  }

  return result;
}

/* ---------------- SORT ---------------- */
function sortProducts(products, sortBy) {
  if (!sortBy || products.length <= 1) return products;

  const arr = products.slice();

  if (sortBy === "priceLow") {
    arr.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    arr.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    arr.sort((a, b) => b.rating - a.rating);
  }

  return arr;
}

/* ---------------- HOOK ---------------- */
export function useFilteredProducts() {
  const products = useProductStore((s) => s.products);

  const search = useProductStore((s) => s.filters.search);
  const categories = useProductStore((s) => s.filters.categories);
  const priceRange = useProductStore((s) => s.filters.priceRange);
  const rating = useProductStore((s) => s.filters.rating);
  const sortBy = useProductStore((s) => s.filters.sortBy);

  // defer BOTH heavy inputs
  const deferredSearch = useDeferredValue(search);
  const deferredSort = useDeferredValue(sortBy);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return filterProducts(products, {
      search: deferredSearch,
      categories,
      priceRange,
      rating,
    });
  }, [products, deferredSearch, categories, priceRange, rating]);

  // defer filtered list (CRITICAL)
  const deferredFiltered = useDeferredValue(filtered);

  /* ---------------- SORT (ONLY WHEN NEEDED) ---------------- */
  const sorted = useMemo(() => {
    return sortProducts(deferredFiltered, deferredSort);
  }, [deferredFiltered, deferredSort]);

  return sorted;
}
