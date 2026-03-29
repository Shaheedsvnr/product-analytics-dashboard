/**
 * getProducts Service
 * --------------------
 * Simulated API layer for fetching product data with caching support.
 *
 * Purpose:
 * - Mimics backend API behavior for frontend development/testing
 * - Provides stable and performant product data retrieval
 *
 * Features:
 * - In-memory caching to avoid unnecessary regeneration
 * - Optional force refresh to regenerate dataset
 * - Simulated network latency (500ms delay)
 * - Safe error handling with structured response format
 *
 * Caching Strategy:
 * - Stores generated products in memory (cachedProducts)
 * - Reuses cached data across calls for performance
 * - Tracks last generation timestamp (lastGeneratedAt)
 *
 * Response Shape:
 * - success: boolean status of request
 * - data: array of products (when successful)
 * - cached: indicates whether response came from cache
 * - generatedAt: timestamp of last generation (if applicable)
 * - error: error message (if failed)
 *
 * Use Case:
 * - Frontend development without backend dependency
 * - Performance testing with large datasets
 * - UI filtering, sorting, virtualization demos
 */
import { generateProducts } from "@/app/lib/data/products";

// In-memory cache (persists across calls during session)
let cachedProducts = null;
let lastGeneratedAt = null;

export async function getProducts({ forceRefresh = false } = {}) {
  try {
    // simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return cached data if exists (MAJOR PERF WIN)
    if (cachedProducts && !forceRefresh) {
      return {
        success: true,
        data: cachedProducts,
        cached: true,
      };
    }

    // generate only when needed
    const data = generateProducts(1000);

    cachedProducts = data;
    lastGeneratedAt = Date.now();

    return {
      success: true,
      data,
      cached: false,
      generatedAt: lastGeneratedAt,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch products",
    };
  }
}
