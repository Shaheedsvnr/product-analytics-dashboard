/**
 * generateProducts Utility
 * ------------------------
 * Fast deterministic product generator for mock.
 *
 * Purpose:
 * - Generates large datasets of fake products efficiently
 * - Ensures stable output using seeded randomness
 * - Useful for pagination, virtualization, and performance testing
 *
 * Features:
 * - Deterministic seeded random generator (same input → same output)
 * - Caching mechanism to avoid re-generating data repeatedly
 * - Configurable product count (default: 1000)
 * - Lightweight and performance-optimized loop-based generation
 *
 * Generated Fields:
 * - id: unique product identifier
 * - name: composed from category + product type + index
 * - price: randomized within realistic range (100 - 5100)
 * - category: fixed category list
 * - rating: 1–5 scale
 * - stock: simulated inventory count
 *
 * Performance Notes:
 * - Avoids heavy computations inside loops
 * - Uses cached result unless force regeneration is requested
 * - Designed for frontend-heavy testing scenarios
 */
const categories = ["Electronics", "Clothing", "Home", "Sports", "Books"];

const productNames = [
  "Pro Max",
  "Ultra",
  "Smart",
  "Advanced",
  "Premium",
  "Lite",
  "X Series",
];

/* ---------------- SEED RANDOM (FASTER + STABLE) ---------------- */
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/* ---------------- CACHE ---------------- */
let cachedProducts = null;

/* ---------------- GENERATOR ---------------- */
export function generateProducts(count = 1000, force = false) {
  if (cachedProducts && !force) return cachedProducts;

  const items = new Array(count);

  for (let i = 0; i < count; i++) {
    const seed = i + 1;

    const category =
      categories[Math.floor(seededRandom(seed) * categories.length)];

    const name =
      productNames[Math.floor(seededRandom(seed * 2) * productNames.length)];

    const price = Math.floor(seededRandom(seed * 3) * 5000) + 100;

    const rating = Math.floor(seededRandom(seed * 4) * 5) + 1;

    const stock = Math.floor(seededRandom(seed * 5) * 200);

    items[i] = {
      id: i + 1,
      name: `${category} ${name} ${i + 1}`,
      price,
      category,
      rating,
      stock,
    };
  }

  cachedProducts = items;
  return items;
}
