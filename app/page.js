"use client";
/* ==========================================================================
   Dashboard Page
   - Main product analytics dashboard UI
   - Handles product fetching, filtering, sorting, and real-time updates
   - Includes responsive layout with mobile filter drawer
   - Integrates analytics, search, and virtualized product list
   ========================================================================== */
import { useEffect, useState, useRef } from "react";
import ProductList from "@/app/components/dashboard/ProductList";
import { getProducts } from "@/app/lib/services/productService";
import { useProductStore } from "@/app/store/useProductStore";
import SearchBar from "@/app/components/dashboard/SearchBar";
import Filters from "@/app/components/dashboard/Filters";
import Sorting from "@/app/components/dashboard/Sorting";
import Analytics from "@/app/components/dashboard/Analytics";
import { useFilteredProducts } from "./hooks/useFilteredProducts";
import { toast } from "sonner";
/* ---------------- FILTER DRAWER ----------------
   Mobile-only slide-up drawer for filters & sorting
   Handles open/close animations and body scroll locking
------------------------------------------------- */
function FilterDrawer({ isOpen, onClose, onClear }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.classList.add("overflow-hidden");
    } else {
      closeTimer.current = setTimeout(() => {
        setShouldRender(false);
      }, 180);

      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      clearTimeout(closeTimer.current);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden flex items-end
      transition-opacity duration-150
      ${isOpen ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-h-[80vh] flex flex-col bg-white rounded-t-2xl shadow-2xl
        will-change-transform
        transition-[transform,opacity] duration-200 ease-out
        ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Filters & Sorting
            </h2>
            <p className="text-xs text-slate-400">Refine your product list</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="sm:hidden">
            <SearchBar />
          </div>
          <Filters />
          <Sorting />
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SCROLL BUTTON ---------------- */
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  /* ---------------- SCROLL TO TOP BUTTON ----------------
   Floating action button that appears after scrolling
   Smoothly scrolls page back to top
-------------------------------------------------------- */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-btn ${visible ? "show" : ""} fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center cursor-pointer ${
        visible ? "show" : ""
      }`}
    >
      ↑
    </button>
  );
}

/* ---------------- DASHBOARD ROOT ----------------
   Main container that:
   - Fetches product data
   - Manages global loading/error states
   - Triggers live updates (polling)
   - Renders analytics + product list
------------------------------------------------ */

export default function Dashboard() {
  const setProducts = useProductStore((s) => s.setProducts);
  const setLoading = useProductStore((s) => s.setLoading);
  const clearFilters = useProductStore((s) => s.clearFilters);
  const filteredProducts = useFilteredProducts();
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const res = await getProducts();

      if (!mounted) return;

      if (res.success) {
        setProducts(res.data);
      } else {
        const msg = res.error || "Failed to load products.";

        setError(msg); // optional (keep if you want UI fallback)
        toast.error(msg); // modern UX feedback
      }

      setLoading(false);
    };

    loadData();

    const interval = setInterval(() => {
      useProductStore.getState().updateRandomProduct();
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setLoading, setProducts]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Product Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Real-time product insights and performance monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:block w-64">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2 lg:hidden w-full">
              <div className="flex-1">
                <SearchBar />
              </div>

              {/* ✅ no transition */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-300 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition"
              >
                ☰ Filter
              </button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 space-y-5">
              <Filters />
              <div className="border-t border-slate-100 pt-4">
                <Sorting />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <section>
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Overview
                  </h2>
                  <p className="text-xs text-slate-400">High-level metrics</p>
                </div>

                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-full">
                  Live · 3s
                </span>
              </div>

              <Analytics />
            </section>

            <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">
                    Products
                  </h2>
                  <p className="text-xs text-slate-400">All tracked products</p>
                </div>

                <span className="text-xs bg-slate-100 px-3 py-2 rounded-full">
                  {filteredProducts?.length}
                  {filteredProducts?.length > 1 ? " items" : " item"}
                </span>
              </div>

              <div className="px-5 py-4">
                <ProductList />
              </div>
            </section>
          </main>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onClear={clearFilters}
      />

      <ScrollToTopButton />
    </div>
  );
}
