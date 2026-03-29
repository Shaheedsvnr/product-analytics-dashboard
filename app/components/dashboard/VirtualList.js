"use client";
/**
 * VirtualList Component
 * ---------------------
 * High-performance virtualized list renderer using React Virtuoso.
 *
 * Features:
 * - Efficiently renders large product datasets using windowing
 * - Displays skeleton loaders during data fetching state
 * - Delegates row rendering to ProductCard component
 * - Fixed item height for consistent virtualization performance
 *
 * Performance Notes:
 * - Only renders visible items plus overscan buffer (5 items)
 * - Prevents DOM overload for large product lists
 * - Optimized for smooth scrolling experience
 *
 * Loading State:
 * - Shows lightweight skeleton placeholders while data is loading
 */
import React, { memo } from "react";
import { Virtuoso } from "react-virtuoso";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/app/store/useProductStore";

function ProductRowSkeleton() {
  return (
    <div className="px-2 py-2 animate-pulse">
      <div className="h-[90px] w-full bg-slate-200 rounded-xl" />
    </div>
  );
}

function VirtualList({ products = [] }) {
  const loading = useProductStore((state) => state.loading);

  if (loading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductRowSkeleton key={i} />
        ))}
      </div>
    );
  }
  const renderItem = (index, product) => (
    <div style={{ height: 110 }}>
      <ProductCard product={product} />
    </div>
  );
  return (
    <Virtuoso
      style={{ height: 600 }}
      data={products}
      itemContent={renderItem}
      overscan={5}
    />
  );
}

export default memo(VirtualList);
