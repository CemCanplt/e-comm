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
    priceRange.current[0],
    priceRange.current[1],
  ]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const itemsPerPage = 12;

  // URL'den parametreleri alma
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter") || "";
    const sort = searchParams.get("sort") || "featured";

    setFilterText(filter);
    setSortOption(sort);
  }, [location.search]);

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

      if (category.id === "all") {
        history.push("/shop");
        return;
      }

      const gender = category.gender === "k" ? "kadin" : "erkek";
      const categoryName = category.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      history.push(`/shop/${gender}/${categoryName}/${category.id}`);
    },
    [history]
  );

  // Cinsiyet değişikliği için yönlendirme
  const handleGenderChange = useCallback(
    (genderCode) => {
      setSelectedGenderFilter(genderCode);

      if (genderCode === "all") {
        history.push("/shop");
      } else {
        const genderPath = genderCode === "k" ? "kadin" : "erkek";
        history.push(`/shop/${genderPath}`);
      }
    },
    [history]
  );

  // Sayfalama offset'i
  const offset = (page - 1) * itemsPerPage;

  // Ürün listeleme fonksiyonu
  const fetchFilteredProducts = useCallback(() => {
    const params = {
      limit: itemsPerPage,
      offset: offset,
    };

    if (categoryId) {
      params.category_id = parseInt(categoryId);
    }

    if (filterText && filterText.trim() !== "") {
      params.filter = filterText.trim();
    }

    if (sortOption && sortOption !== "featured") {
      params.sort = sortOption;
    }

    dispatch(fetchProducts(params));
  }, [dispatch, categoryId, filterText, sortOption, offset, itemsPerPage]);

  // URL güncelleme
  const updateUrlWithFilters = useCallback(() => {
    const searchParams = new URLSearchParams();

    if (filterText) {
      searchParams.set("filter", filterText);
    }

    if (sortOption && sortOption !== "featured") {
      searchParams.set("sort", sortOption);
    }

    const basePath = location.pathname;
    const newUrl =
      basePath + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    history.replace(newUrl);
  }, [filterText, sortOption, history, location.pathname]);

  // Filtre değişikliğinde URL güncelleme
  useEffect(() => {
    updateUrlWithFilters();
  }, [filterText, sortOption, updateUrlWithFilters]);

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
    setPriceValues([priceRange.min, priceRange.max]);
    dispatch(setPriceRange([priceRange.min, priceRange.max]));
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterText("");
    setSortOption("featured");
    history.push("/shop");
  }, [dispatch, history, priceRange.min, priceRange.max]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    selectedCategory,
    setSelectedCategory, // Bu satırı ekleyin
    selectedGenderFilter,
    filterText,
    setFilterText,
    sortOption,
    setSortOption,
    page,
    priceValues,
    filteredCategories,
    itemsPerPage,
    offset,
    navigateToCategory,
    handleGenderChange,
    fetchFilteredProducts,
    updateUrlWithFilters,
    handlePriceRangeChange,
    resetFilters,
    handlePageChange,
  };
};
