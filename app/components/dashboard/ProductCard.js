"use client";
/**
 * ProductCard Component
 * ---------------------
 * Virtualized list item renderer for product data using React Virtuoso.
 *
 * Features:
 * - Optimized for large lists via virtualization (React Virtuoso)
 * - Displays product info: name, category, rating, stock, price
 * - Live update indicator for recently updated products
 * - Category-based dynamic styling system
 * - Lightweight star rating visualization
 *
 * Performance Notes:
 * - Designed to render only visible items (windowing via Virtuoso)
 * - Uses useMemo to avoid recalculating derived UI state
 * - Wrapped with React.memo for extra render safety (optional layer)
 */
import React, { useMemo } from "react";
import moment from "moment";

/* ---------------- CATEGORY STYLE MAP ---------------- */
const CATEGORY_STYLES = {
  Electronics: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Clothing: "bg-rose-50 text-rose-700 border-rose-100",
  Home: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Sports: "bg-amber-50 text-amber-700 border-amber-100",
  Books: "bg-sky-50 text-sky-700 border-sky-100",
};

/* ---------------- STAR RATING COMPONENT ---------------- */
function RatingStars({ rating }) {
  const full = Math.floor(rating || 0);
  const max = 5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => {
          const active = i < full;

          return (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill={active ? "#facc15" : "none"}
              stroke={active ? "#eab308" : "#cbd5f5"}
              strokeWidth="1.2"
            >
              <path d="M10 2.5l2.09 4.23 4.66.68-3.38 3.29.8 4.61L10 13.77 5.83 15.3l.8-4.61L3.25 7.41l4.66-.68L10 2.5z" />
            </svg>
          );
        })}
      </div>

      <span className="text-xs text-slate-500">
        {rating?.toFixed?.(1) ?? "0.0"}
      </span>
    </div>
  );
}

/* ---------------- PRODUCT CARD BASE ---------------- */
function ProductCardBase({ product, style, ariaAttributes }) {
  if (!product) return null;

  /* derive live status, formatted time, and category styles */
  const { isLive, updatedText, categoryClass } = useMemo(() => {
    const lastUpdated = product.lastUpdated
      ? new Date(product.lastUpdated)
      : null;

    const lastUpdatedTime = new Date(lastUpdated).getTime();

    const live = !isNaN(lastUpdatedTime) && Date.now() - lastUpdatedTime < 5000;
    const updated = lastUpdated ? moment(lastUpdated).fromNow() : "";

    const category =
      CATEGORY_STYLES[product.category] ||
      "bg-slate-50 text-slate-600 border-slate-100";

    return {
      isLive: live,
      updatedText: updated,
      categoryClass: category,
    };
  }, [product]);

  return (
    <div
      style={style}
      {...ariaAttributes}
      className="px-3 sm:px-4 py-2.5 border-b border-slate-100 bg-white hover:bg-slate-50 transition-colors"
    >
      <div className="flex h-full gap-3 sm:gap-4">
        {/* LEFT: product info */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* title + live badge */}
          <div className="flex items-start gap-2">
            <h3 className="text-sm sm:text-[15px] font-semibold text-slate-800 truncate">
              {product.name}
            </h3>

            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>

          {/* category */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[13px] text-slate-500">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${categoryClass}`}
            >
              {product.category}
            </span>
          </div>

          {/* rating + stock */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-[13px]">
            <RatingStars rating={product.rating} />

            <span className="text-slate-500">
              Stock:{" "}
              <span className="font-medium text-slate-700">
                {product.stock}
              </span>
            </span>
          </div>
        </div>

        {/* RIGHT: price + update info */}
        <div className="flex flex-col items-end justify-between text-right">
          <span className="font-semibold text-slate-800">₹{product.price}</span>
          <span className="text-[11px] text-slate-400">
            {lastUpdatedLabel(updatedText)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- LAST UPDATED HELPER ---------------- */
function lastUpdatedLabel(text) {
  return text ? `Updated ${text}` : "";
}

/* ---------------- MEMOIZED EXPORT ---------------- */
const ProductCard = React.memo(ProductCardBase);
export default ProductCard;
