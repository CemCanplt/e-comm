import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  setSortBy,
  setPriceRange,
  setGenderFilter,
} from "../store/reducers/productReducer";
import { fetchProducts } from "../store/actions/productActions";

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

  // Filtreleme state'leri
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [page, setPage] = useState(1);
  const [priceValues, setPriceValues] = useState([
    priceRange?.current?.[0] || 0,
    priceRange?.current?.[1] || 1000,
  ]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const itemsPerPage = 12;

  // URL güncelleme - declare this function first to avoid the circular reference
  const updateUrlWithFilters = useCallback(
    (params = {}) => {
      const currentParams = new URLSearchParams(location.search);
      const searchParams = new URLSearchParams();

      // Preserve existing params unless overridden
      for (const [key, value] of currentParams.entries()) {
        searchParams.set(key, value);
      }

      // Set new params
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

      const basePath = location.pathname;
      const newUrl =
        basePath +
        (searchParams.toString() ? `?${searchParams.toString()}` : "");

      history.replace(newUrl);
    },
    [filterText, sortOption, history, location.pathname, location.search, page]
  );

  // URL'den parametreleri alma - enhanced to handle refresh
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter") || "";
    const sort = searchParams.get("sort") || "featured";
    const pageParam = parseInt(searchParams.get("page"), 10) || 1;

    setFilterText(filter);
    setSortOption(sort);
    setPage(pageParam);

    // Apply the sort option to Redux state
    if (sort !== "featured") {
      dispatch(setSortBy(sort));
    }
  }, [location.search, dispatch]);

  // Ürün listeleme fonksiyonu - now using the already defined updateUrlWithFilters function
  const fetchFilteredProducts = useCallback(
    (additionalParams = {}) => {
      const params = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      };

      if (categoryId) {
        params.category_id = parseInt(categoryId);
      }

      if (filterText && filterText.trim() !== "") {
        params.filter = filterText.trim();
      }

      // Get sort option from URL or state
      const searchParams = new URLSearchParams(location.search);
      const urlSortOption = searchParams.get("sort");

      const effectiveSortOption =
        additionalParams.sort || urlSortOption || sortOption;

      if (effectiveSortOption && effectiveSortOption !== "featured") {
        params.sort = effectiveSortOption;
      }

      // Handle price range if set
      if (
        priceValues &&
        (priceValues[0] > priceRange?.min || priceValues[1] < priceRange?.max)
      ) {
        params.priceMin = priceValues[0];
        params.priceMax = priceValues[1];
      }

      // Handle gender filtering
      if (selectedGenderFilter && selectedGenderFilter !== "all") {
        params.gender = selectedGenderFilter;
      }

      // Include any additional params passed directly
      Object.assign(params, additionalParams);

      // Update URL
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
      location.search,
      priceRange,
      priceValues,
      selectedGenderFilter,
      updateUrlWithFilters,
    ]
  );

  // Enhanced to ensure filters are applied on first load and after refresh
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const hasFilters = searchParams.toString().length > 0;

    if (hasFilters) {
      // Set a short timeout to ensure the component is fully mounted
      const timer = setTimeout(() => {
        fetchFilteredProducts();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.search, fetchFilteredProducts]); // Added fetchFilteredProducts to dependencies

  // Cinsiyet filtreleme
  useEffect(() => {
    if (gender) {
      setSelectedGenderFilter(gender === "kadin" ? "k" : "e");
    } else {
      setSelectedGenderFilter("all");
    }
  }, [gender]);

  // Kategori ID filtreleme
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    } else {
      setSelectedCategory("All");
    }
  }, [categoryId]);

  // Kategori seçimi için yönlendirme fonksiyonu
  const navigateToCategory = useCallback(
    (category) => {
      if (!category) return;

      // "all" kategorisi için tüm ürünleri göster
      if (category.id === "all") {
        setSelectedCategory("All");

        // Preserve current URL parameters like sort
        const searchParams = new URLSearchParams(location.search);
        const sortParam = searchParams.get("sort");

        if (sortParam) {
          history.push(`/shop?sort=${sortParam}`);
        } else {
          history.push("/shop");
        }

        // Tüm ürünleri getir
        const params = {
          limit: itemsPerPage,
          offset: 0,
          sort: sortParam || undefined,
        };
        dispatch(fetchProducts(params));
        return;
      }

      // Kategori ID'sini kullan
      setSelectedCategory(category.id);

      // Cinsiyet belirle
      const genderText = category.genderCode === "k" ? "kadin" : "erkek";

      // Slug oluştur (varsa kullan, yoksa kategori adından oluştur)
      const categorySlug =
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // Preserve current URL parameters like sort
      const searchParams = new URLSearchParams(location.search);
      const sortParam = searchParams.get("sort");

      // URL oluştur
      let categoryUrl = `/shop/${genderText}/${categorySlug}/${category.id}`;
      if (sortParam) {
        categoryUrl += `?sort=${sortParam}`;
      }

      history.push(categoryUrl);

      // Ürünleri bu kategoriye göre filtrele
      const params = {
        limit: itemsPerPage,
        offset: 0,
        category_id: category.id,
        sort: sortParam || undefined,
      };
      dispatch(fetchProducts(params));
    },
    [history, dispatch, itemsPerPage, location.search]
  );

  // Cinsiyet değişikliği için yönlendirme
  const handleGenderChange = useCallback(
    (genderCode) => {
      setSelectedGenderFilter(genderCode);

      // Preserve current URL parameters like sort
      const searchParams = new URLSearchParams(location.search);
      const sortParam = searchParams.get("sort");

      if (genderCode === "all") {
        if (sortParam) {
          history.push(`/shop?sort=${sortParam}`);
        } else {
          history.push("/shop");
        }
      } else {
        const genderPath = genderCode === "k" ? "kadin" : "erkek";
        if (sortParam) {
          history.push(`/shop/${genderPath}?sort=${sortParam}`);
        } else {
          history.push(`/shop/${genderPath}`);
        }
      }
    },
    [history, location.search]
  );

  // Sıralama değişikliğinde Redux güncelleme
  useEffect(() => {
    if (sortOption) {
      dispatch(setSortBy(sortOption));
    }
  }, [sortOption, dispatch]);

  // Fiyat aralığı değişikliği
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

  // Filtre sıfırlama
  const resetFilters = useCallback(() => {
    setPriceValues([priceRange?.min || 0, priceRange?.max || 1000]);
    dispatch(setPriceRange([priceRange?.min || 0, priceRange?.max || 1000]));
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterText("");
    setSortOption("featured");
    history.push("/shop");
  }, [dispatch, history, priceRange]);

  // Kategorileri cinsiyete göre filtreleme
  useEffect(() => {
    const categoriesByGender = categories
      ? selectedGenderFilter === "all"
        ? categories
        : categories.filter((cat) => cat.gender === selectedGenderFilter)
      : [];

    setFilteredCategories(categoriesByGender);
  }, [categories, selectedGenderFilter]);

  // Cinsiyet parametresi değiştiğinde
  useEffect(() => {
    if (gender) {
      const genderCode = gender === "kadin" ? "k" : "e";
      setSelectedGenderFilter(genderCode);

      if (!categorySlug) {
        const params = {
          limit: itemsPerPage,
          offset: 0,
        };

        dispatch(setGenderFilter(genderCode));

        const genderedCategories = categories?.filter(
          (cat) => cat.genderCode === genderCode || cat.gender === genderCode
        );

        setFilteredCategories(genderedCategories || []);
        dispatch(fetchProducts(params));
      }
    } else {
      setSelectedGenderFilter("all");
      dispatch(setGenderFilter(null));
    }
  }, [gender, dispatch, categories, itemsPerPage, categorySlug]);

  // Kategori slug parametresi değiştiğinde
  useEffect(() => {
    if (gender && categorySlug && !categoryId) {
      const genderCode = gender === "kadin" ? "k" : "e";
      const category = categories?.find(
        (cat) =>
          (cat.slug === categorySlug ||
            cat.title.toLowerCase().replace(/\s+/g, "-") === categorySlug) &&
          (cat.genderCode === genderCode || cat.gender === genderCode)
      );

      if (category) {
        setSelectedCategory(category.id);
        const params = {
          limit: itemsPerPage,
          offset: 0,
          category_id: category.id,
        };

        dispatch(fetchProducts(params));
      }
    }
  }, [gender, categorySlug, categoryId, categories, dispatch, itemsPerPage]);

  // Sayfalama değişikliği
  const handlePageChange = (newPage) => {
    setPage(newPage);

    // Update URL with page parameter
    const params = new URLSearchParams(location.search);
    if (newPage > 1) {
      params.set("page", newPage.toString());
    } else {
      params.delete("page");
    }

    const newUrl = `${location.pathname}?${params.toString()}`;
    history.replace(newUrl);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch products for the new page
    fetchFilteredProducts({ offset: (newPage - 1) * itemsPerPage });
  };

  return {
    selectedCategory,
    setSelectedCategory,
    selectedGenderFilter,
    filterText,
    setFilterText,
    sortOption,
    setSortOption,
    page,
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
