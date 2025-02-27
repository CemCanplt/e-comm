/**
 * Service for filtering products by gender using category relationships
 */
class GenderFilterService {
  /**
   * Filters products by gender using the relationship between products and categories
   *
   * @param {Array} products - The products to filter
   * @param {Array} categories - The categories with gender information
   * @param {string} genderFilter - The gender to filter by ('k' for women, 'e' for men, null or 'all' for all)
   * @returns {Array} - The filtered products
   */
  static filterProductsByGender(products, categories, genderFilter) {
    // Return all products if no gender filter or filter is 'all'
    if (!genderFilter || genderFilter === "all") {
      return products;
    }

    // Create a map of categories by ID for quick lookup
    const categoryMap = categories.reduce((map, category) => {
      map[category.id] = category;
      return map;
    }, {});

    // Filter products based on their category's gender
    return products.filter((product) => {
      // Check if the product has a category_id that matches a category with the specified gender
      if (product.category_id && categoryMap[product.category_id]) {
        const category = categoryMap[product.category_id];
        return (
          category.gender === genderFilter ||
          category.genderCode === genderFilter
        );
      }

      // If product has direct gender info, use that
      if (product.gender) {
        return product.gender === genderFilter;
      }

      // If no gender information can be found, exclude the product
      return false;
    });
  }
}

export default GenderFilterService;
