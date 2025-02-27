import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  setSortBy,
  setPriceRange,
  setGenderFilter,
} from "../store/reducers/productReducer";
import { fetchProducts } from "../store/actions/productActions";
import axios from "axios";

const baseURL = "https://workintech-fe-ecommerce.onrender.com";

function useShopFilters(initialState) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { productList } = useSelector((state) => state.product);

  // Consolidated filters state
  const [filters, setFilters] = useState({
    category: initialState.categoryId
      ? parseInt(initialState.categoryId)
      : "All",
    gender: initialState.gender
      ? initialState.gender === "kadin"
        ? "k"
        : "e"
      : "all",
    text: "",
    sort: "featured",
    page: 1,
    priceRange: [
      initialState.priceRange?.current?.[0] || 0,
      initialState.priceRange?.current?.[1] || 1000,
    ],
    filteredCategories: [],
  });

  // UI state
  const [ui, setUi] = useState({
    viewMode: "grid",
    showFilters: false,
    expandedSections: {
      categories: true,
      price: true,
    },
  });

  const itemsPerPage = 12;

  // Helper function to update individual filter properties
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // URL update function
  const updateUrlWithFilters = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);

    if (filters.text) {
      searchParams.set("filter", filters.text);
    } else {
      searchParams.delete("filter");
    }

    if (filters.sort !== "featured") {
      searchParams.set("sort", filters.sort);
    } else {
      searchParams.delete("sort");
    }

    if (filters.page > 1) {
      searchParams.set("page", filters.page.toString());
    } else {
      searchParams.delete("page");
    }

    const newUrl =
      location.pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");
    history.replace(newUrl);
  }, [
    filters.text,
    filters.sort,
    filters.page,
    history,
    location.pathname,
    location.search,
  ]);

  // Load params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter") || "";
    const sortParam = searchParams.get("sort") || "featured";
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;

    setFilters((prev) => ({
      ...prev,
      text: filterParam,
      sort: sortParam,
      page: pageParam,
    }));

    if (sortParam !== "featured") {
      dispatch(setSortBy(sortParam));
    }
  }, [location.search, dispatch]);

  // Product fetching function
  const fetchFilteredProducts = useCallback(
    (additionalParams = {}) => {
      const params = {
        limit: itemsPerPage,
        offset: (filters.page - 1) * itemsPerPage,
      };

      if (initialState.categoryId) {
        params.category_id = parseInt(initialState.categoryId);
      }

      // Apply filter
      const filterValue = additionalParams.filter ?? filters.text?.trim();
      if (filterValue) params.filter = filterValue;

      // Apply gender filter
      const genderValue = additionalParams.gender ?? filters.gender;
      if (genderValue && genderValue !== "all") params.gender = genderValue;

      // Apply sort
      const sortValue = additionalParams.sort ?? filters.sort;
      if (sortValue !== "featured") params.sort = sortValue;

      // Apply price range
      if (
        additionalParams.priceMin ||
        filters.priceRange[0] > initialState.priceRange?.min
      ) {
        params.priceMin = additionalParams.priceMin ?? filters.priceRange[0];
      }

      if (
        additionalParams.priceMax ||
        filters.priceRange[1] < initialState.priceRange?.max
      ) {
        params.priceMax = additionalParams.priceMax ?? filters.priceRange[1];
      }

      updateUrlWithFilters();
      dispatch(fetchProducts(params));
    },
    [
      dispatch,
      initialState.categoryId,
      filters,
      itemsPerPage,
      initialState.priceRange,
      updateUrlWithFilters,
    ]
  );

  // The rest of the functions would be updated similarly to use the consolidated filters state
  // I'll show a few examples below

  // Handle gender filter change
  const handleGenderChange = useCallback(
    (genderValue) => {
      dispatch(setGenderFilter(genderValue === "all" ? null : genderValue));
      updateFilter("gender", genderValue);
      updateFilter("page", 1);

      const params = { limit: itemsPerPage, offset: 0 };
      if (genderValue !== "all") params.gender = genderValue;

      dispatch(fetchProducts(params));

      history.push(
        genderValue === "all"
          ? "/shop"
          : `/shop/${genderValue === "k" ? "kadin" : "erkek"}`
      );
    },
    [dispatch, history, itemsPerPage, updateFilter]
  );

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    const newPriceRange =
      name === "min"
        ? [numValue, filters.priceRange[1]]
        : [filters.priceRange[0], numValue];

    updateFilter("priceRange", newPriceRange);
    dispatch(setPriceRange(newPriceRange));
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: "All",
      gender: "all",
      text: "",
      sort: "featured",
      page: 1,
      priceRange: [
        initialState.priceRange?.min || 0,
        initialState.priceRange?.max || 1000,
      ],
      filteredCategories: initialState.categories || [],
    });

    dispatch(
      setPriceRange([
        initialState.priceRange?.min || 0,
        initialState.priceRange?.max || 1000,
      ])
    );
    history.push("/shop");
  }, [dispatch, history, initialState.priceRange, initialState.categories]);

  // For backward compatibility, you can create getter functions for components that expect the old individual states
  return {
    filters,
    updateFilter,
    resetFilters,
    selectedCategory: filters.category,
    setSelectedCategory: (value) => updateFilter("category", value),
    selectedGenderFilter: filters.gender,
    setSelectedGenderFilter: (value) => updateFilter("gender", value),
    filterText: filters.text,
    setFilterText: (value) => updateFilter("text", value),
    sortOption: filters.sort,
    setSortOption: (value) => updateFilter("sort", value),
    page: filters.page,
    setPage: (value) => updateFilter("page", value),
    priceValues: filters.priceRange,
    filteredCategories: filters.filteredCategories,
    itemsPerPage,
    // Include all other functions that were previously returned
    fetchFilteredProducts,
    handleGenderChange,
    handlePriceRangeChange,
    // ... other functions
  };
}

export default useShopFilters;
