"use client";
// Input validation: limiting length to prevent abuse and ensure performance
import { useEffect, useState, useRef, useCallback } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import { useProductStore } from "@/app/store/useProductStore";

export default function SearchBar() {
  const search = useProductStore((state) => state.filters.search);
  const setFilters = useProductStore((state) => state.setFilters);

  const [localSearch, setLocalSearch] = useState(search);

  const debouncedSearch = useDebounce(localSearch, 300);

  const lastAppliedRef = useRef("");

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (typeof debouncedSearch !== "string") return;

    if (debouncedSearch.length > 100) return; // limit size

    if (debouncedSearch === lastAppliedRef.current) return;

    lastAppliedRef.current = debouncedSearch;
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  const handleChange = useCallback((e) => {
    if (e.target.value.length > 1000) return;
    setLocalSearch(e.target.value);
  }, []);
  return (
    <div className="w-full">
      <div className="relative max-w-full">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
            />
          </svg>
        </span>

        <input
          type="text"
          placeholder="Search products..."
          value={localSearch}
          onChange={handleChange}
          className="block w-full rounded-xl border border-slate-200 bg-white/80 pl-9 pr-3 py-2 text-sm md:text-[15px] text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
        />
      </div>
    </div>
  );
}
