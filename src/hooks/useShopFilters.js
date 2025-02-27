import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const useShopFilters = ({
  gender: initialGender,
  categoryId: initialCategoryId,
  categories,
}) => {
  const history = useHistory();
  const location = useLocation();

  // Başlangıç durumunu belirle
  const [filters, setFilters] = useState({
    gender:
      initialGender === "kadin" ? "k" : initialGender === "erkek" ? "e" : null,
    category: initialCategoryId ? parseInt(initialCategoryId) : null,
    text: "",
    sort: "featured",
    page: 1,
    priceRange: [0, 1000],
  });

  // URL'den filtreleri yükle
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    setFilters((prev) => ({
      ...prev,
      text: searchParams.get("filter") || prev.text,
      sort: searchParams.get("sort") || prev.sort,
      page: parseInt(searchParams.get("page")) || 1,
      priceRange: [
        parseInt(searchParams.get("price_min")) || prev.priceRange[0],
        parseInt(searchParams.get("price_max")) || prev.priceRange[1],
      ],
    }));
  }, [location.search]);

  // URL'yi güncelle
  const updateUrl = (newFilters) => {
    const searchParams = new URLSearchParams();
    let basePath = "/shop";

    // Gender ve category parametrelerini URL path'ine ekle
    if (newFilters.gender) {
      const genderText = newFilters.gender === "k" ? "kadin" : "erkek";
      basePath += `/${genderText}`;

      if (newFilters.category) {
        const category = categories?.find(
          (cat) => cat.id === newFilters.category
        );
        if (category) {
          const categorySlug =
            category.slug ||
            category.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
          basePath += `/${categorySlug}/${category.id}`;
        }
      }
    } else if (newFilters.category) {
      const category = categories?.find(
        (cat) => cat.id === newFilters.category
      );
      if (category) {
        const categorySlug =
          category.slug ||
          category.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
        basePath += `/category/${categorySlug}/${category.id}`;
      }
    }

    // Diğer filtreleri query string'e ekle
    if (newFilters.text) searchParams.set("filter", newFilters.text);
    if (newFilters.sort !== "featured")
      searchParams.set("sort", newFilters.sort);
    if (newFilters.page > 1)
      searchParams.set("page", newFilters.page.toString());
    if (newFilters.priceRange[0] > 0)
      searchParams.set("price_min", newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < 1000)
      searchParams.set("price_max", newFilters.priceRange[1].toString());

    const query = searchParams.toString();
    history.push(query ? `${basePath}?${query}` : basePath);
  };

  // Filter değişiklik fonksiyonları
  const handleGenderChange = (gender) => {
    const newFilters = { ...filters, gender, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleCategoryChange = (categoryId) => {
    const newFilters = { ...filters, category: parseInt(categoryId), page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleTextSearch = (text) => {
    const newFilters = { ...filters, text, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleSortChange = (sort) => {
    const newFilters = { ...filters, sort, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handlePriceChange = (priceRange) => {
    const newFilters = { ...filters, priceRange, page: 1 };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const resetFilters = () => {
    const newFilters = {
      gender: null,
      category: null,
      text: "",
      sort: "featured",
      page: 1,
      priceRange: [0, 1000],
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  return {
    filters,
    handleGenderChange,
    handleCategoryChange,
    handleTextSearch,
    handleSortChange,
    handlePriceChange,
    handlePageChange,
    resetFilters,
  };
};

export default useShopFilters;
