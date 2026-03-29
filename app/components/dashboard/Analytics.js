"use client";

/**
 * =========================================================
 * Analytics Dashboard Component
 * =========================================================
 *
 * Purpose:
 * This component provides real-time analytics for products
 * using filtered Zustand store data and derived computations.
 *
 * Features:
 * - KPI statistics (total products, categories, avg price, top category)
 * - Recharts visualizations (Bar + Pie charts)
 * - Memoized performance-optimized calculations
 * - Skeleton loading states to prevent layout shift
 *
 * Data Flow:
 * Zustand Store → useFilteredProducts → getAnalytics()
 * → Derived stats (useMemo) → UI rendering (Recharts + cards)
 *
 * Performance Optimizations:
 * - useMemo for expensive aggregations
 * - Memoized tooltip components
 * - Stable skeleton arrays to avoid re-creation
 *
 * Notes:
 * - UI/logic is intentionally kept unchanged
 * - Only code structure, readability, and documentation improved
 * =========================================================
 */

import { useMemo, memo } from "react";
import { useProductStore } from "@/app/store/useProductStore";
import { useFilteredProducts } from "@/app/hooks/useFilteredProducts";
import { getAnalytics } from "@/app/lib/utils/analytics";
import { Icon } from "@iconify/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

/* =========================================================
   CONSTANTS
   ========================================================= */

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#7c3aed",
  "#4f46e5",
  "#818cf8",
  "#c4b5fd",
];

/* =========================================================
   PRESENTATIONAL COMPONENTS
   ========================================================= */

/**
 * KPI Card Component
 * Used for rendering dashboard statistics
 */
function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {label}
        </p>

        <span
          className={`flex items-center justify-center w-8 h-8 rounded-xl text-base ${accent}`}
        >
          {icon}
        </span>
      </div>

      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>

      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

/**
 * Chart Container Wrapper
 * Provides consistent layout for all charts
 */
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-0.5 mb-4">{subtitle}</p>
      )}

      <div className="h-[300px] w-full min-h-[300px]">{children}</div>
    </div>
  );
}

/* =========================================================
   MEMOIZED TOOLTIP COMPONENTS
   ========================================================= */

/**
 * Price Tooltip for Bar Chart
 */
const TooltipPrice = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 mb-0.5">{label}</p>
      <p className="text-indigo-600 font-bold">
        ₹{Number(payload[0].value).toFixed(2)}
      </p>
    </div>
  );
});

/**
 * Count Tooltip for Bar Chart
 */
const TooltipCount = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 mb-0.5">{label}</p>
      <p className="text-violet-600 font-bold">{payload[0].value} products</p>
    </div>
  );
});

/**
 * Pie Chart Tooltip
 */
const TooltipPie = memo(({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-700 mb-0.5">{payload[0].name}</p>

      <p className="font-bold" style={{ color: payload[0].payload.fill }}>
        {payload[0].value} products ({payload[0].payload.percent}%)
      </p>
    </div>
  );
});

/* =========================================================
   SKELETON COMPONENTS
   ========================================================= */

/**
 * Loading Skeleton for Stat Cards
 */
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-8 w-8 bg-slate-200 rounded-xl" />
      </div>

      <div className="h-6 w-24 bg-slate-200 rounded mt-4" />
      <div className="h-3 w-32 bg-slate-100 rounded mt-3" />
    </div>
  );
}

/**
 * Loading Skeleton for Charts
 */
function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="h-4 w-40 bg-slate-200 rounded mb-4" />
      <div className="h-52 bg-slate-100 rounded" />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Analytics() {
  const products = useFilteredProducts();
  const loading = useProductStore((state) => state.loading);

  /**
   * Normalize product data to prevent undefined crashes
   */
  const safeProducts = products ?? [];

  /**
   * Derived analytics from raw product data
   */
  const data = useMemo(() => {
    return getAnalytics(safeProducts);
  }, [safeProducts]);

  /**
   * Aggregated dashboard statistics
   */
  const stats = useMemo(() => {
    if (!data.length) return null;

    let totalProducts = 0;
    let totalAvgPrice = 0;

    let topCat = data[0];
    let mostExpensive = data[0];

    for (let i = 0; i < data.length; i++) {
      const d = data[i];

      totalProducts += d.count;
      totalAvgPrice += d.avgPrice;

      if (d.count > topCat.count) topCat = d;
      if (d.avgPrice > mostExpensive.avgPrice) mostExpensive = d;
    }

    return {
      totalProducts,
      avgPrice: totalAvgPrice / data.length,
      topCat,
      mostExpensive,
    };
  }, [data]);

  /**
   * Pie chart dataset transformation
   */
  const pieData = useMemo(() => {
    if (!data.length) return [];

    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].count;
    }

    return data.map((d, i) => ({
      name: d.category,
      value: d.count,
      fill: COLORS[i % COLORS.length],
      percent: total ? ((d.count / total) * 100).toFixed(1) : 0,
    }));
  }, [data]);

  /**
   * Stable skeleton array (prevents re-creation per render)
   */
  const skeletonArray = useMemo(() => Array.from({ length: 4 }), []);

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="space-y-5">
      {/* ================= KPI SECTION ================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? skeletonArray.map((_, i) => <StatCardSkeleton key={i} />)
          : stats && (
              <>
                <StatCard
                  label="Total Products"
                  value={stats.totalProducts.toLocaleString()}
                  sub="Across all categories"
                  accent="bg-indigo-50 text-indigo-500"
                  icon={<Icon icon="heroicons:cube" width="18" height="18" />}
                />

                <StatCard
                  label="Categories"
                  value={data.length}
                  sub="Distinct product groups"
                  accent="bg-violet-50 text-violet-500"
                  icon={
                    <Icon
                      icon="heroicons:currency-rupee"
                      width="18"
                      height="18"
                    />
                  }
                />

                <StatCard
                  label="Overall Avg Price"
                  value={`₹${stats.avgPrice.toFixed(2)}`}
                  sub="Mean across categories"
                  accent="bg-emerald-50 text-emerald-500"
                  icon={
                    <Icon
                      icon="heroicons:currency-rupee"
                      width="18"
                      height="18"
                    />
                  }
                />

                <StatCard
                  label="Top Category"
                  value={stats.topCat?.category ?? "—"}
                  sub={`${stats.topCat?.count ?? 0} products`}
                  accent="bg-amber-50 text-amber-500"
                  icon={<Icon icon="heroicons:trophy" width="18" height="18" />}
                />
              </>
            )}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <ChartCard
              title="Average Price by Category"
              subtitle="Mean product price per category (₹)"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="30%">
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    content={<TooltipPrice />}
                    cursor={{ fill: "#f5f3ff" }}
                  />
                  <Bar dataKey="avgPrice" radius={[6, 6, 0, 0]} maxBarSize={44}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Product Distribution"
              subtitle="Share of products per category"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius="45%"
                    outerRadius="70%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} strokeWidth={0} />
                    ))}
                  </Pie>

                  <Tooltip content={<TooltipPie />} />

                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-slate-500">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}
      </div>

      {/* ================= FINAL CHART ================= */}
      {loading ? (
        <ChartSkeleton />
      ) : (
        <ChartCard
          title="Product Count by Category"
          subtitle="Total number of products listed per category"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap="30%">
              <XAxis
                dataKey="category"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<TooltipCount />}
                cursor={{ fill: "#f5f3ff" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[(i + 2) % COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
