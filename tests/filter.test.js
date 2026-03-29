import { describe, it, expect } from "vitest";
import { filterProducts } from "../app/lib/utils/filterProducts";

/* -----------------------------
   TEST SUITE
------------------------------ */
describe("Product Filtering System", () => {
  it("should filter by search text", () => {
    const products = [
      { name: "iPhone 15", category: "Electronics", price: 1000, rating: 5 },
      {
        name: "Samsung Galaxy",
        category: "Electronics",
        price: 800,
        rating: 4,
      },
    ];

    const result = filterProducts(products, {
      search: "iphone",
      categories: [],
      priceRange: [0, Infinity],
      rating: 0,
    });

    expect(result).toEqual([
      { name: "iPhone 15", category: "Electronics", price: 1000, rating: 5 },
    ]);
  });

  it("should filter by category", () => {
    const products = [
      { name: "iPhone", category: "Electronics", price: 1000, rating: 5 },
      { name: "Shirt", category: "Clothing", price: 500, rating: 4 },
    ];

    const result = filterProducts(products, {
      search: "",
      categories: ["Electronics"],
      priceRange: [0, Infinity],
      rating: 0,
    });

    expect(result).toEqual([
      { name: "iPhone", category: "Electronics", price: 1000, rating: 5 },
    ]);
  });

  it("should filter by price range", () => {
    const products = [
      { name: "A", category: "X", price: 100, rating: 3 },
      { name: "B", category: "X", price: 500, rating: 4 },
    ];

    const result = filterProducts(products, {
      search: "",
      categories: [],
      priceRange: [0, 200],
      rating: 0,
    });

    expect(result).toEqual([
      { name: "A", category: "X", price: 100, rating: 3 },
    ]);
  });

  it("should filter by rating", () => {
    const products = [
      { name: "A", category: "X", price: 100, rating: 2 },
      { name: "B", category: "X", price: 100, rating: 4 },
    ];

    const result = filterProducts(products, {
      search: "",
      categories: [],
      priceRange: [0, Infinity],
      rating: 4,
    });

    expect(result).toEqual([
      { name: "B", category: "X", price: 100, rating: 4 },
    ]);
  });

  it("should apply all filters together (AND logic)", () => {
    const products = [
      { name: "iPhone 15", category: "Electronics", price: 1000, rating: 5 },
      { name: "iPhone 11", category: "Electronics", price: 500, rating: 3 },
      { name: "Shirt", category: "Clothing", price: 500, rating: 4 },
    ];

    const result = filterProducts(products, {
      search: "iphone",
      categories: ["Electronics"],
      priceRange: [0, 1000],
      rating: 4,
    });

    expect(result).toEqual([
      { name: "iPhone 15", category: "Electronics", price: 1000, rating: 5 },
    ]);
  });

  it("should return empty array when no match", () => {
    const products = [
      { name: "iPhone", category: "Electronics", price: 1000, rating: 5 },
    ];

    const result = filterProducts(products, {
      search: "nokia",
      categories: [],
      priceRange: [0, Infinity],
      rating: 0,
    });

    expect(result).toEqual([]);
  });

  it("should return all products when filters are empty", () => {
    const products = [
      { name: "A", category: "X", price: 100, rating: 1 },
      { name: "B", category: "Y", price: 200, rating: 2 },
    ];

    const result = filterProducts(products, {
      search: "",
      categories: [],
      priceRange: [0, Infinity],
      rating: 0,
    });

    expect(result.map((p) => p.name)).toEqual(["A", "B"]);
  });
  it("should handle empty or undefined products safely", () => {
    expect(
      filterProducts(undefined, {
        search: "",
        categories: [],
        priceRange: [0, Infinity],
        rating: 0,
      }),
    ).toEqual([]);

    expect(
      filterProducts([], {
        search: "",
        categories: [],
        priceRange: [0, Infinity],
        rating: 0,
      }),
    ).toEqual([]);
  });
  it("should be case-insensitive for search", () => {
    const products = [
      { name: "iPhone", category: "Electronics", price: 100, rating: 4 },
    ];

    const result = filterProducts(products, {
      search: "IPHONE",
      categories: [],
      priceRange: [0, Infinity],
      rating: 0,
    });

    expect(result.length).toBe(1);
  });
});
