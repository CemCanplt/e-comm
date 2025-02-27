import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import { fetchProducts } from "../store/actions/productActions";
import ShopHeader from "./shop/ShopHeader";
import ShopProducts from "./shop/ShopProducts";
import useShopFilters from "../hooks/useShopFilters";
import FilterBar from "./shop/filters/FilterBar";

function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categorySlug, categoryId } = useParams();
  const { products, categories, loading } = useSelector((state) => ({
    products: state.product.productList,
    categories: state.categories.items || [],
    loading: state.product.fetchState === "FETCHING",
  }));

  const initialLoadDone = useRef(false);
  const prevFilters = useRef(null);

  // Load categories
  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Use filter hook
  const {
    filters,
    handleGenderChange,
    handleCategoryChange,
    handleTextSearch,
    handleSortChange,
    handlePriceChange,
    handlePageChange,
    resetFilters,
  } = useShopFilters({
    gender: gender === "women" ? "k" : gender === "men" ? "e" : null,
    categoryId,
    categories,
  });

  // Handle gender filter change
  const onGenderChange = (value) => {
    const newGender = value === "all" ? null : value;
    handleGenderChange(newGender);

    // Update URL
    let newPath = "/shop";
    if (newGender) {
      newPath += `/${newGender === "k" ? "women" : "men"}`;
      if (filters.category) {
        const category = categories.find((c) => c.id === filters.category);
        if (category) {
          const slug =
            category.slug || category.title.toLowerCase().replace(/\s+/g, "-");
          newPath += `/${slug}/${category.id}`;
        }
      }
    } else if (filters.category) {
      const category = categories.find((c) => c.id === filters.category);
      if (category) {
        const slug =
          category.slug || category.title.toLowerCase().replace(/\s+/g, "-");
        newPath += `/${slug}/${category.id}`;
      }
    }
    history.push(newPath);
  };

  // Check if filters have changed
  const haveFiltersChanged = () => {
    if (!prevFilters.current) return true;

    return JSON.stringify(prevFilters.current) !== JSON.stringify(filters);
  };

  // Load products on initial load and URL parameter changes
  useEffect(() => {
    if (!initialLoadDone.current || haveFiltersChanged()) {
      const selectedCategory = categories.find(
        (c) => c.id === filters.category
      );

      const params = {
        limit: 12,
        offset: (filters.page - 1) * 12,
        ...(filters.category && { category_id: filters.category }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.text && { filter: filters.text }),
        ...(filters.sort !== "featured" && { sort: filters.sort }),
        ...(filters.priceRange && {
          price_min: filters.priceRange[0],
          price_max: filters.priceRange[1],
        }),
      };

      // Add gender from category if available
      if (selectedCategory?.gender) {
        params.gender = selectedCategory.gender;
      }

      dispatch(fetchProducts(params));
      initialLoadDone.current = true;
      prevFilters.current = { ...filters };
    }
  }, [dispatch, filters, categories]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopHeader
        gender={gender}
        selectedGender={filters.gender}
        onGenderChange={onGenderChange}
        categories={categories}
        categorySlug={categorySlug}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4">
          <div className="sticky top-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <FilterBar
              categories={categories}
              selectedCategory={filters.category}
              filterText={filters.text}
              setFilterText={handleTextSearch}
              handleCategoryChange={handleCategoryChange}
              handlePriceChange={handlePriceChange}
              resetFilters={resetFilters}
            />
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
          <ShopProducts
            loading={loading}
            filters={filters}
            handleSortChange={handleSortChange}
            handlePageChange={handlePageChange}
            resetFilters={resetFilters}
          />
        </main>
      </div>
    </div>
  );
}

export default Shop;
