import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import { fetchProducts } from "../store/actions/productActions";
import {
  setGenderFilter,
  setFetchState,
} from "../store/reducers/productReducer";

// Components
import ShopBreadcrumb from "./shop/ShopBreadcrumb";
import GenderFilter from "./shop/GenderFilter";
import FilterBar from "./shop/FilterBar";
import ProductToolbar from "./shop/ProductToolbar";
import ProductGrid from "./shop/ProductGrid";

function Shop() {
  const dispatch = useDispatch();
  const { gender, categorySlug, categoryId } = useParams();
  const history = useHistory();

  const { productList, priceRange, total, fetchState } = useSelector(
    (state) => state.product,
    shallowEqual
  );
  const { categories } = useSelector((state) => state.categories, shallowEqual);
  // UI state
  const DEFAULT_VIEW_MODE = "grid";
  const [viewMode, setViewMode] = useState(DEFAULT_VIEW_MODE);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    price: true,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(() => {
    if (gender === "kadin") return "k";
    if (gender === "erkek") return "e";
    return "all";
  });
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [page, setPage] = useState(1);
  const [priceValues, setPriceValues] = useState([
    priceRange?.min || 0,
    priceRange?.max || 1000,
  ]);

  // Filtered products state - yeni implementasyon
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Loading state
  const isProductsLoading = fetchState === "FETCHING";

  // Kategorileri yükle
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // İlk ürünleri yükle ve URL parametrelerini işle
  useEffect(() => {
    // İlk olarak yükleniyor durumunu ayarla
    dispatch(setFetchState("FETCHING"));

    // URL'den gender bilgisini al ve iç state'i güncelle
    if (gender) {
      const genderCode = gender === "kadin" ? "k" : "e";
      setSelectedGenderFilter(genderCode);
    } else {
      setSelectedGenderFilter("all");
    }

    // Kategori bilgisini güncelle
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    }

    // API için parametreleri hazırla
    const params = { limit: 12, offset: 0 };
    if (gender) {
      params.gender = gender === "kadin" ? "k" : "e";
    }
    if (categoryId) {
      params.category_id = parseInt(categoryId);
    }

    console.log("İlk yükleme parametreleri:", params);

    // Ürünleri getir
    dispatch(fetchProducts(params));
  }, [dispatch, gender, categoryId]);

  // API'den ürünler gelince işleme - Önceki client-side filtrelemeyi kaldırıyoruz
  useEffect(() => {
    if (fetchState === "FETCHED" && productList && productList.length > 0) {
      console.log("Ürün listesi güncellendi:", productList.length);

      // API'den gelen ürünleri doğrudan göster, client-side filtreleme yapma
      setDisplayedProducts(productList);
    }
  }, [productList, fetchState]);

  // API'den ürünler gelince filtreleme yap - Client-side filtrelemeyi tekrar ekleyelim
  useEffect(() => {
    if (fetchState === "FETCHED" && productList && productList.length > 0) {
      console.log("Ürün listesi güncellendi:", productList.length);

      // Cinsiyet filtresi aktif ise client-side filtreleme yapalım
      if (
        selectedGenderFilter !== "all" &&
        categories &&
        categories.length > 0
      ) {
        // Kategori cinsiyetlerini içeren bir harita oluştur
        const categoryGenderMap = {};
        categories.forEach((category) => {
          categoryGenderMap[category.id] =
            category.gender || category.genderCode;
        });

        // Ürünleri filtrele - kategorilerin cinsiyetlerine göre
        const filtered = productList.filter((product) => {
          if (product.category_id && categoryGenderMap[product.category_id]) {
            return (
              categoryGenderMap[product.category_id] === selectedGenderFilter
            );
          }
          return false;
        });

        console.log(
          `Client-side cinsiyet filtresi sonrası (${selectedGenderFilter}): ${filtered.length} ürün`
        );
        setDisplayedProducts(filtered);
      } else {
        // Filtre yoksa tüm ürünleri göster
        setDisplayedProducts(productList);
      }
    }
  }, [productList, fetchState, categories, selectedGenderFilter]);

  // Kategori haritası oluştur - hızlı erişim için
  const categoryMap = useMemo(() => {
    const map = {};
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        map[category.id] = category;
      });
    }
    return map;
  }, [categories]);

  // Gender change handler - Düzeltilmiş versiyon
  const handleGenderChange = (gender) => {
    console.log("Cinsiyet filtreleme başlatılıyor:", gender);

    // İşleme başlamadan önce yükleme durumunu ayarla
    dispatch(setFetchState("FETCHING"));

    // Redux ve component state'lerini güncelle
    dispatch(setGenderFilter(gender === "all" ? null : gender));
    setSelectedGenderFilter(gender);

    // Sayfa 1'e dön
    setPage(1);

    // Kategori seçimini sıfırla
    setSelectedCategory("All");

    // Doğru URL'e yönlendir
    const newUrl =
      gender === "all"
        ? "/shop"
        : `/shop/${gender === "k" ? "kadin" : "erkek"}`;

    history.push(newUrl);

    // API çağrısı parametrelerini hazırla - server ve client filtering birlikte çalışsın
    const params = {
      limit: 12,
      offset: 0,
    };

    // Cinsiyet filtresi
    if (gender !== "all") {
      params.gender = gender;
    }

    console.log("Cinsiyet filtresi API parametreleri:", params);

    // API çağrısını yap
    dispatch(fetchProducts(params));
  };

  // Toggle filter sections
  const toggleFilterSection = (section) => {
    setExpandedFilterSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    const newValue = Number(value);

    setPriceValues((prev) =>
      name === "min" ? [newValue, prev[1]] : [prev[0], newValue]
    );
  };

  // Apply filters with API call - Filtreleme fonksiyonunu düzeltiyoruz
  const applyFilters = () => {
    // Always reset to page 1 when applying filters
    setPage(1);

    const params = {
      limit: 12,
      offset: 0, // İlk sayfadan başla
    };

    if (selectedCategory !== "All") params.category_id = selectedCategory;
    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (filterText) params.filter = filterText;
    if (sortOption !== "featured") params.sort = sortOption;

    // Fiyat filtrelerini ekle
    if (priceValues[0] > (priceRange?.min || 0)) {
      params.priceMin = priceValues[0];
    }
    if (priceValues[1] < (priceRange?.max || 1000)) {
      params.priceMax = priceValues[1];
    }

    console.log("Filtreleme parametreleri:", params);

    // Filtreleri API ile uygula
    dispatch(fetchProducts(params))
      .then((response) => {
        console.log(`Toplam filtrelenmiş ürün: ${response.total}`);

        // Filtrelenmiş ürünleri göster
        setDisplayedProducts(response.products);

        // Client-side filtreleme kaldırıldı - tamamen API'ye güveniyoruz
      })
      .catch((error) => {
        console.error("Filtreleme hatası:", error);
      });
  };

  // Update the handlePageChange function
  const handlePageChange = (newPage) => {
    // Update page state
    setPage(newPage);

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Calculate the correct offset based on the page number
    const offset = (newPage - 1) * 12;

    // Build params with all current filters
    const params = {
      limit: 12,
      offset: offset,
    };

    // Include all active filters in pagination requests
    if (selectedCategory !== "All") params.category_id = selectedCategory;
    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (filterText) params.filter = filterText;
    if (sortOption !== "featured") params.sort = sortOption;

    // Important: Include price filters in pagination
    if (priceValues[0] > (priceRange?.min || 0)) {
      params.priceMin = priceValues[0];
    }
    if (priceValues[1] < (priceRange?.max || 1000)) {
      params.priceMax = priceValues[1];
    }

    console.log(
      `Fetching page ${newPage} with offset:`,
      offset,
      "and filters:",
      params
    );

    // This will fetch only the items for this page, with filters applied
    dispatch(fetchProducts(params))
      .then((response) => {
        console.log(
          `Page ${newPage} data received: ${response.products.length} items`
        );
        setDisplayedProducts(response.products);
      })
      .catch((error) => {
        console.error("Error fetching page:", error);
      });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedGenderFilter("all");
    setFilterText("");
    setSortOption("featured");
    setPriceValues([priceRange?.min || 0, priceRange?.max || 1000]);
    setPage(1);
    history.push("/shop");
    dispatch(fetchProducts({ limit: 12, offset: 0 }));
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    // Debugging için category nesnesini incele
    console.log("Seçilen kategori:", category);

    // Kategori "all" ise
    if (category.id === "all") {
      setSelectedCategory("All");

      // URL'i güncelle - eğer cinsiyet seçili ise onu koru
      const url =
        selectedGenderFilter !== "all"
          ? `/shop/${selectedGenderFilter === "k" ? "kadin" : "erkek"}`
          : "/shop";

      history.push(url);

      // API parametreleri - "all" seçildiğinde category_id parametresi olmamalı
      const params = {
        limit: 12,
        offset: 0,
      };

      // Sadece cinsiyet filtresi varsa ekle
      if (selectedGenderFilter !== "all") {
        params.gender = selectedGenderFilter;
      }

      console.log("All kategorisi seçildi, API parametreleri:", params);
      dispatch(fetchProducts(params));
    } else {
      // Önemli: category.id bir string olabilir, integer'a dönüştür
      const categoryId = parseInt(category.id);

      // State'i güncelle
      setSelectedCategory(categoryId);
      console.log(
        `Kategori seçildi (numeric ID): ${categoryId}, Başlık: ${category.title}`
      );

      // URL için gerekli bilgileri hazırla
      const genderParam =
        selectedGenderFilter !== "all"
          ? selectedGenderFilter === "k"
            ? "kadin"
            : "erkek"
          : null;

      const slug =
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      // URL'i güncelle - cinsiyet seçiliyse dahil et, değilse yalnızca kategori
      if (genderParam) {
        history.push(`/shop/${genderParam}/${slug}/${categoryId}`);
      } else {
        history.push(`/shop/category/${slug}/${categoryId}`);
      }

      // API parametrelerini hazırla - doğrudan numeric değer kullan
      const params = {
        limit: 12,
        offset: 0,
        category_id: categoryId,
      };

      // Eğer cinsiyet filtresi aktifse, onu da ekle
      if (selectedGenderFilter !== "all") {
        params.gender = selectedGenderFilter;
      }

      console.log("Kategori seçildi, API parametreleri:", params);
      dispatch(fetchProducts(params));
    }
  };

  // Page title based on gender
  const pageTitle = gender
    ? gender === "kadin"
      ? "Women's Collection"
      : "Men's Collection"
    : "All Products";

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopBreadcrumb
        gender={gender}
        categorySlug={categorySlug}
        category={
          selectedCategory !== "All" && categories
            ? categories.find((cat) => cat.id === selectedCategory)
            : null
        }
      />

      <GenderFilterSection
        selectedGenderFilter={selectedGenderFilter}
        title={pageTitle}
        onGenderChange={handleGenderChange}
      />

      <MobileFilterButton
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      <MainContentArea
        filterText={filterText}
        setFilterText={setFilterText}
        expandedFilterSections={expandedFilterSections}
        toggleFilterSection={toggleFilterSection}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleCategorySelect={handleCategorySelect}
        priceValues={priceValues}
        handlePriceRangeChange={handlePriceRangeChange}
        priceRange={priceRange}
        dispatch={dispatch}
        sortOption={sortOption}
        setSortOption={setSortOption} // Bu satırı ekleyin - eksik olan prop
        showFilters={showFilters}
        resetFilters={resetFilters}
        setShowFilters={setShowFilters}
        applyFilters={applyFilters}
        displayedProducts={displayedProducts}
        total={total}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isProductsLoading={isProductsLoading}
        totalPages={totalPages}
        page={page}
        handlePageChange={handlePageChange}
        selectedGenderFilter={selectedGenderFilter}
      />
    </div>
  );
}

const GenderFilterSection = ({
  selectedGenderFilter,
  title,
  onGenderChange,
}) => (
  <section className="mb-8">
    <GenderFilter
      selectedGenderFilter={selectedGenderFilter}
      title={title}
      onGenderChange={onGenderChange}
    />
  </section>
);

const MobileFilterButton = ({ showFilters, setShowFilters }) => (
  <div className="md:hidden mb-6">
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
    >
      <Filter className="mr-2 h-5 w-5" />
      {showFilters ? "Hide Filters" : "Show Filters"}
    </button>
  </div>
);

const MainContentArea = ({
  filterText,
  setFilterText,
  expandedFilterSections,
  toggleFilterSection,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleCategorySelect,
  priceValues,
  handlePriceRangeChange,
  priceRange,
  dispatch,
  sortOption,
  setSortOption, // Bu satırı ekleyin - eksik olan prop
  showFilters,
  resetFilters,
  setShowFilters,
  applyFilters,
  displayedProducts,
  total,
  viewMode,
  setViewMode,
  isProductsLoading,
  totalPages,
  page,
  handlePageChange,
  selectedGenderFilter,
}) => (
  <div className="grid grid-cols-12 gap-6">
    <aside className="col-span-12 md:col-span-3">
      <FilterBar
        filterText={filterText}
        setFilterText={setFilterText}
        expandedFilterSections={expandedFilterSections}
        toggleFilterSection={toggleFilterSection}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        navigateToCategory={handleCategorySelect}
        priceValues={priceValues}
        handlePriceRangeChange={handlePriceRangeChange}
        priceRange={priceRange}
        dispatch={dispatch}
        sortOption={sortOption}
        showFilters={showFilters}
        resetFilters={resetFilters}
        setShowFilters={setShowFilters}
        fetchFilteredProducts={applyFilters}
      />
    </aside>

    <main className="col-span-12 md:col-span-9">
      <ProductToolbar
        displayedProducts={displayedProducts}
        total={total}
        sortOption={sortOption}
        setSortOption={setSortOption} // Bu prop'u doğru şekilde geçiriyoruz
        viewMode={viewMode}
        setViewMode={setViewMode}
        fetchFilteredProducts={applyFilters}
      />

      <ProductGrid
        isLoading={isProductsLoading}
        products={displayedProducts}
        viewMode={viewMode}
        totalPages={totalPages}
        page={page}
        handlePageChange={handlePageChange}
        resetFilters={resetFilters}
        selectedGenderFilter={selectedGenderFilter}
        filterText={filterText}
      />
    </main>
  </div>
);

export default Shop;
