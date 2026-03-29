"use client";
/**
 * ProductList Component
 * ---------------------
 * Container component responsible for rendering filtered products
 * inside a virtualized list (React Virtuoso via VirtualList wrapper).
 *
 * Features:
 * - Consumes filtered product data via custom hook
 * - Ensures stable array reference using useMemo
 * - Handles empty state gracefully (no products UI)
 * - Delegates rendering to VirtualList for performance optimization
 *
 * Performance Notes:
 * - Wrapped with React.memo to avoid unnecessary re-renders
 * - Uses virtualization to efficiently render large datasets
 * - Ensures safe handling of non-array data from store/hook
 */
import { memo, useMemo } from "react";
import VirtualList from "./VirtualList";
import { useFilteredProducts } from "@/app/hooks/useFilteredProducts";

function ProductList() {
  const filteredProducts = useFilteredProducts();
  const products = useMemo(() => {
    return Array.isArray(filteredProducts) ? filteredProducts : [];
  }, [filteredProducts]);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-10">
        <p className="text-sm text-slate-400">No products found.</p>
      </div>
    );
  }

  return <VirtualList products={products} />;
}

export default memo(ProductList);
