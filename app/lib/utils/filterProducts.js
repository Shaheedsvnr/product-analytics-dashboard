export function filterProducts(products, filters) {
  if (!products?.length) return [];

  const search = filters.search?.toLowerCase() || "";
  const hasSearch = search.length > 0;

  const categories = filters.categories || [];
  const hasCategory = categories.length > 0;
  const categorySet = hasCategory ? new Set(categories) : null;

  const [min, max] = filters.priceRange || [0, Infinity];
  const minRating = filters.rating || 0;

  const result = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    if (p.price < min || p.price > max) continue;
    if (minRating && p.rating < minRating) continue;
    if (hasCategory && !categorySet.has(p.category)) continue;
    if (hasSearch && !p.name.toLowerCase().includes(search)) continue;

    result.push(p);
  }

  return result;
}
