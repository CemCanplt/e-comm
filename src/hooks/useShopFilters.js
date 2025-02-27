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

export const useShopFilters = ({
  priceRange,
  gender,
  categoryId,
  categorySlug,
  categories,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { productList } = useSelector((state) => state.product);

  // State definitions
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [filterText, setFilterTextState] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [page, setPage] = useState(1);
  const [priceValues, setPriceValues] = useState([
    priceRange?.current?.[0] || 0,
    priceRange?.current?.[1] || 1000,
  ]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const itemsPerPage = 12;

  // URL update function
  const updateUrlWithFilters = useCallback(
    (params = {}) => {
      const searchParams = new URLSearchParams(location.search);

      if (params.filter || filterText) {
        searchParams.set("filter", params.filter || filterText);
      } else {
        searchParams.delete("filter");
      }

      if (params.sort || sortOption !== "featured") {
        searchParams.set("sort", params.sort || sortOption);
      } else {
        searchParams.delete("sort");
      }

      if (page > 1) {
        searchParams.set("page", page.toString());
      } else {
        searchParams.delete("page");
      }

      const newUrl =
        location.pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");
      history.replace(newUrl);
    },
    [filterText, sortOption, history, location.pathname, location.search, page]
  );

  // Load params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter") || "";
    const sort = searchParams.get("sort") || "featured";
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;

    setFilterTextState(filter);
    setSortOption(sort);
    setPage(pageParam);

    if (sort !== "featured") {
      dispatch(setSortBy(sort));
    }
  }, [location.search, dispatch]);

  // Product fetching function
  const fetchFilteredProducts = useCallback(
    (additionalParams = {}) => {
      const params = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      };

      if (categoryId) {
        params.category_id = parseInt(categoryId);
      }

      // Apply filter
      const filterValue = additionalParams.filter ?? filterText?.trim();
      if (filterValue) params.filter = filterValue;

      // Apply gender filter
      const genderValue = additionalParams.gender ?? selectedGenderFilter;
      if (genderValue && genderValue !== "all") params.gender = genderValue;

      // Apply sort
      const sortValue = additionalParams.sort ?? sortOption;
      if (sortValue !== "featured") params.sort = sortValue;

      // Apply price range
      if (additionalParams.priceMin || priceValues[0] > priceRange?.min) {
        params.priceMin = additionalParams.priceMin ?? priceValues[0];
      }

      if (additionalParams.priceMax || priceValues[1] < priceRange?.max) {
        params.priceMax = additionalParams.priceMax ?? priceValues[1];
      }

      updateUrlWithFilters(params);
      dispatch(fetchProducts(params));
    },
    [
      dispatch,
      categoryId,
      filterText,
      sortOption,
      page,
      itemsPerPage,
      priceRange,
      priceValues,
      selectedGenderFilter,
      updateUrlWithFilters,
    ]
  );

  // Apply filters on URL change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.toString().length > 0) {
      setTimeout(() => fetchFilteredProducts(), 100);
    }
  }, [location.search, fetchFilteredProducts]);

  // Handle gender filter from URL
  useEffect(() => {
    if (gender) {
      setSelectedGenderFilter(gender === "kadin" ? "k" : "e");
    } else {
      setSelectedGenderFilter("all");
    }
  }, [gender]);

  // Handle category from URL
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    } else {
      setSelectedCategory("All");
    }
  }, [categoryId]);

  // Category navigation handler
  const navigateToCategory = useCallback(
    (category) => {
      if (!category) return;

      if (category.id === "all") {
        setSelectedCategory("All");
        const searchParams = new URLSearchParams(location.search);
        const sortParam = searchParams.get("sort");

        history.push(sortParam ? `/shop?sort=${sortParam}` : "/shop");

        dispatch(
          fetchProducts({
            limit: itemsPerPage,
            offset: 0,
            sort: sortParam || undefined,
          })
        );
        return;
      }

      setSelectedCategory(category.id);
      const genderText = category.genderCode === "k" ? "kadin" : "erkek";
      const slug =
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const searchParams = new URLSearchParams(location.search);
      const sortParam = searchParams.get("sort");

      let url = `/shop/${genderText}/${slug}/${category.id}`;
      if (sortParam) url += `?sort=${sortParam}`;

      history.push(url);

      dispatch(
        fetchProducts({
          limit: itemsPerPage,
          offset: 0,
          category_id: category.id,
          sort: sortParam || undefined,
        })
      );
    },
    [history, dispatch, itemsPerPage, location.search]
  );

  // Gender filter handler
  const handleGenderChange = useCallback(
    (genderValue) => {
      dispatch(setGenderFilter(genderValue === "all" ? null : genderValue));
      setSelectedGenderFilter(genderValue);
      setPage(1);

      const params = { limit: itemsPerPage, offset: 0 };
      if (genderValue !== "all") params.gender = genderValue;

      dispatch(fetchProducts(params));

      history.push(
        genderValue === "all"
          ? "/shop"
          : `/shop/${genderValue === "k" ? "kadin" : "erkek"}`
      );
    },
    [dispatch, history, itemsPerPage]
  );

  // Update Redux on sort change
  useEffect(() => {
    if (sortOption) dispatch(setSortBy(sortOption));
  }, [sortOption, dispatch]);

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === "min") {
      setPriceValues([numValue, priceValues[1]]);
      dispatch(setPriceRange([numValue, priceValues[1]]));
    } else {
      setPriceValues([priceValues[0], numValue]);
      dispatch(setPriceRange([priceValues[0], numValue]));
    }
  };

  // Reset all filters
  const resetFilters = useCallback(() => {
    setPriceValues([priceRange?.min || 0, priceRange?.max || 1000]);
    dispatch(setPriceRange([priceRange?.min || 0, priceRange?.max || 1000]));
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterTextState("");
    setSortOption("featured");
    history.push("/shop");
  }, [dispatch, history, priceRange]);

  // Filter categories by gender
  useEffect(() => {
    if (!categories) return;

    setFilteredCategories(
      selectedGenderFilter === "all"
        ? categories
        : categories.filter((cat) => cat.gender === selectedGenderFilter)
    );
  }, [categories, selectedGenderFilter]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);

    const params = new URLSearchParams(location.search);
    newPage > 1
      ? params.set("page", newPage.toString())
      : params.delete("page");

    history.replace(`${location.pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchFilteredProducts({ offset: (newPage - 1) * itemsPerPage });
  };

  // Filter text handler with URL update
  const setFilterText = useCallback(
    (value) => {
      setFilterTextState(value);

      const params = new URLSearchParams(location.search);
      value && value.trim()
        ? params.set("filter", value.trim())
        : params.delete("filter");

      history.replace(
        location.pathname + (params.toString() ? `?${params.toString()}` : "")
      );
    },
    [history, location.pathname, location.search]
  );

  // Initial product fetch
  useEffect(() => {
    if (!productList || productList.length === 0) {
      const params = { limit: itemsPerPage, offset: 0 };

      if (gender) {
        params.gender = gender === "kadin" ? "k" : "e";
        setSelectedGenderFilter(params.gender);
      }

      if (categoryId) {
        params.category_id = parseInt(categoryId);
        setSelectedCategory(parseInt(categoryId));
      }

      dispatch(fetchProducts(params));
    }
  }, [dispatch, gender, categoryId, itemsPerPage, productList]);

  // Email validation with promise chain
  const validateEmail = (value) => {
    return axios
      .get(`${baseURL}/check-email?email=${value}`)
      .then((response) => {
        return response.data.available || "Bu email adresi zaten kayıtlı";
      })
      .catch((error) => {
        console.error("Email kontrol hatası:", error);
        return true;
      });
  };

  return {
    selectedCategory,
    setSelectedCategory,
    selectedGenderFilter,
    setSelectedGenderFilter,
    filterText,
    setFilterText,
    sortOption,
    setSortOption,
    page,
    setPage,
    priceValues,
    filteredCategories,
    itemsPerPage,
    navigateToCategory,
    handleGenderChange,
    fetchFilteredProducts,
    updateUrlWithFilters,
    handlePriceRangeChange,
    resetFilters,
    handlePageChange,
  };
};
