/**
 * getAnalytics Utility
 * --------------------
 * Computes aggregated analytics data from a product dataset.
 *
 * Purpose:
 * - Transforms raw product list into category-level insights
 * - Used for dashboard visualizations (charts, KPIs, summaries)
 *
 * What it calculates:
 * - Total number of products per category (count)
 * - Average price per category (avgPrice)
 *
 * How it works:
 * - Iterates through all products once (O(n) performance)
 * - Groups products by category using a hash map
 * - Accumulates total price and count per category
 * - Converts grouped data into an array format for UI consumption
 *
 * Output Shape:
 * [
 *   {
 *     category: string,
 *     count: number,
 *     avgPrice: number
 *   }
 * ]
 *
 * Performance Notes:
 * - Single-pass iteration (efficient for large datasets)
 * - No nested loops or expensive computations
 */
export function getAnalytics(products = []) {
  const categoryMap = {};

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    if (!categoryMap[p.category]) {
      categoryMap[p.category] = {
        totalPrice: 0,
        count: 0,
      };
    }

    categoryMap[p.category].totalPrice += p.price;
    categoryMap[p.category].count += 1;
  }

  return Object.entries(categoryMap).map(([category, value]) => ({
    category,
    count: value.count,
    avgPrice: value.totalPrice / value.count,
  }));
}
