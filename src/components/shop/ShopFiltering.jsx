import { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../store/actions/productActions";

const useShopFiltering = (initialFilters = {}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // Combined state for all filters
  const [filters, setFilters] = useState({
    category: initialFilters.categoryId
      ? parseInt(initialFilters.categoryId)
      : null,
    gender: initialFilters.gender || null,
    text: "",
    sort: "featured",
    page: 1,
    priceRange: [0, 1000],
    ...initialFilters,
  });

  // Parse URL query parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Extract filter parameters from URL
    const filterParam = searchParams.get("filter");
    const sortParam = searchParams.get("sort");
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;
    const minPriceParam = parseInt(searchParams.get("price_min"), 10);
    const maxPriceParam = parseInt(searchParams.get("price_max"), 10);

    // Update state with URL parameters
    setFilters((prev) => ({
      ...prev,
      text: filterParam || prev.text,
      sort: sortParam || prev.sort,
      page: pageParam,
      priceRange: [
        !isNaN(minPriceParam) ? minPriceParam : prev.priceRange[0],
        !isNaN(maxPriceParam) ? maxPriceParam : prev.priceRange[1],
      ],
    }));
  }, [location.search]);

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters = filters) => {
      const searchParams = new URLSearchParams();

      // Add parameters to URL only if they have values
      if (newFilters.text) {
        searchParams.set("filter", newFilters.text);
      }

      if (newFilters.sort !== "featured") {
        searchParams.set("sort", newFilters.sort);
      }

      if (newFilters.page > 1) {
        searchParams.set("page", newFilters.page.toString());
      }

      if (newFilters.priceRange[0] > 0) {
        searchParams.set("price_min", newFilters.priceRange[0].toString());
      }

      if (newFilters.priceRange[1] < 1000) {
        searchParams.set("price_max", newFilters.priceRange[1].toString());
      }

      // Calculate base path based on gender and category
      let basePath = "/shop";

      if (newFilters.gender) {
        const genderText = newFilters.gender === "k" ? "kadin" : "erkek";
        basePath += `/${genderText}`;

        if (newFilters.category) {
          const category = initialFilters.categories?.find(
            (c) => c.id === newFilters.category
          );
          if (category) {
            const slug =
              category.slug ||
              category.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            basePath += `/${slug}/${newFilters.category}`;
          }
        }
      } else if (newFilters.category) {
        const category = initialFilters.categories?.find(
          (c) => c.id === newFilters.category
        );
        if (category) {
          const slug =
            category.slug ||
            category.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
          basePath += `/category/${slug}/${newFilters.category}`;
        }
      }

      // Update URL with or without query parameters
      const query = searchParams.toString();
      const newUrl = query ? `${basePath}?${query}` : basePath;
      history.push(newUrl);
    },
    [filters, history, initialFilters.categories]
  );

  // Build API parameters object from filters
  const buildApiParams = useCallback(() => {
    const params = {
      limit: 12,
      offset: (filters.page - 1) * 12,
    };

    if (filters.category) {
      params.category = filters.category;
    }

    if (filters.gender) {
      params.gender = filters.gender;
    }

    if (filters.text) {
      params.filter = filters.text;
    }

    if (filters.sort !== "featured") {
      params.sort = filters.sort;
    }

    if (filters.priceRange[0] > 0) {
      params.price_min = filters.priceRange[0];
    }

    if (filters.priceRange[1] < 1000) {
      params.price_max = filters.priceRange[1];
    }

    return params;
  }, [filters]);

  // Apply filters and fetch products from API
  const applyFilters = useCallback(() => {
    const params = buildApiParams();
    updateUrl();
    return dispatch(fetchProducts(params));
  }, [buildApiParams, updateUrl, dispatch]);

  // Filter handlers
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when changing filters (except when changing page itself)
      page: key === "page" ? value : 1,
    }));
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback(
    (categoryId) => {
      const newCategory = categoryId === "all" ? null : parseInt(categoryId);
      setFilter("category", newCategory);
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Handle gender change
  const handleGenderChange = useCallback(
    (gender) => {
      const newGender = gender === "all" ? null : gender;
      setFilter("gender", newGender);
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Handle text search
  const handleTextSearch = useCallback(
    (text) => {
      setFilter("text", text);
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sort) => {
      setFilter("sort", sort);
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Handle price range change
  const handlePriceChange = useCallback(
    (priceRange) => {
      setFilter("priceRange", priceRange);
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page) => {
      setFilter("page", page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      applyFilters();
    },
    [setFilter, applyFilters]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: null,
      gender: null,
      text: "",
      sort: "featured",
      page: 1,
      priceRange: [0, 1000],
    });
    history.push("/shop");
    dispatch(fetchProducts({ limit: 12, offset: 0 }));
  }, [history, dispatch]);

  return {
    filters,
    setFilter,
    applyFilters,
    handleCategoryChange,
    handleGenderChange,
    handleTextSearch,
    handleSortChange,
    handlePriceChange,
    handlePageChange,
    resetFilters,
  };
};

export default useShopFiltering;
