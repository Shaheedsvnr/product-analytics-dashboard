/**
 * useProductStore (Zustand Store)
 * -------------------------------
 * Central global state manager for product dashboard application.
 *
 * Purpose:
 * - Manages product data, filters, and UI state globally
 * - Provides reactive state updates for filtering, sorting, and analytics
 *
 * State Structure:
 * - products: array of product objects (with optimized nameLower field)
 * - loading: boolean flag for API loading state
 * - filters: user-selected filter configuration
 *   - search: text search query
 *   - categories: selected category filters
 *   - priceRange: [min, max] price filter
 *   - rating: minimum rating filter
 *   - sortBy: sorting preference
 *
 * Actions:
 * - setProducts: stores products with precomputed lowercase name for fast search
 * - setLoading: toggles loading state
 * - setFilters: shallow merges filter updates
 * - clearFilters: resets all filters to default state
 * - updateRandomProduct: simulates real-time product updates (price/stock changes)
 *
 * Performance Optimizations:
 * - Pre-computes nameLower for faster search filtering
 * - Avoids heavy computation inside store actions
 * - Uses immutable updates for predictable state changes
 * - Efficient random update without full recomputation
 *
 * Use Case:
 * - Product dashboards
 * - Real-time UI simulations
 * - Filtering and analytics-driven interfaces
 */

import { create } from "zustand";

/* ---------------- STORE ---------------- */
export const useProductStore = create((set) => ({
  /* ---------------- STATE ---------------- */
  products: [],
  loading: false,

  filters: {
    search: "",
    categories: [],
    priceRange: [0, Infinity],
    rating: 0,
    sortBy: "",
  },

  /* ---------------- SET PRODUCTS ---------------- */
  setProducts: (products) =>
    set({
      products: products.map((p) => ({
        ...p,
        nameLower: (p.name || "").toLowerCase(),
      })),
    }),

  setLoading: (loading) => set({ loading }),

  /* ---------------- FILTER UPDATE ---------------- */
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  /* ---------------- CLEAR FILTERS ---------------- */
  clearFilters: () =>
    set({
      filters: {
        search: "",
        categories: [],
        priceRange: [0, Infinity],
        rating: 0,
        sortBy: "",
      },
    }),

  /* ---------------- REAL-TIME UPDATE ---------------- */
  updateRandomProduct: () =>
    set((state) => {
      if (!state.products.length) return state;

      const index = (Math.random() * state.products.length) | 0;
      const p = state.products[index];

      const updated = {
        ...p,
        price: Math.max(0, p.price + ((Math.random() * 100 - 50) | 0)),
        stock: Math.max(0, p.stock + ((Math.random() * 10 - 5) | 0)),
        lastUpdated: Date.now(),
      };

      const products = [...state.products];
      products[index] = updated;

      return { products };
    }),
}));
