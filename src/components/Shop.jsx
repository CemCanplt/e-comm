import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchCategories } from "../store/actions/categoryActions";
import { fetchProducts } from "../store/actions/productActions";
import { setGenderFilter } from "../store/reducers/productReducer";

// Components
import ShopBreadcrumb from "./shop/ShopBreadcrumb";
import GenderFilter from "./shop/GenderFilter";
import FilterBar from "./shop/FilterBar";
import ProductToolbar from "./shop/ProductToolbar";
import ProductGrid from "./shop/ProductGrid";

function Shop() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { gender, categorySlug, categoryId } = useParams();

  // Redux store state
  const { productList, priceRange, total, fetchState } = useSelector(
    (state) => state.product
  );
  const { categories } = useSelector((state) => state.categories);

  // UI state
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState({
    categories: true,
    price: true,
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGenderFilter, setSelectedGenderFilter] = useState(
    gender === "kadin" ? "k" : gender === "erkek" ? "e" : "all"
  );
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
    const params = { limit: 12, offset: 0 };

    if (gender) {
      params.gender = gender === "kadin" ? "k" : "e";
      setSelectedGenderFilter(params.gender);
    } else {
      setSelectedGenderFilter("all");
    }

    if (categoryId) {
      params.category_id = parseInt(categoryId);
      setSelectedCategory(parseInt(categoryId));
    }

    console.log("İlk yükleme parametreleri:", params);
    dispatch(fetchProducts(params));
  }, [dispatch, gender, categoryId]);

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

  // API'den gelen ürün listesini ayarla - Burada değişiklik yapıyoruz
  useEffect(() => {
    if (productList && productList.length > 0) {
      console.log("Ürün listesi güncellendi:", productList.length);

      // Cinsiyet filtrelemesi uygula
      if (
        selectedGenderFilter !== "all" &&
        categories &&
        categories.length > 0
      ) {
        // Kategorilerden bir map oluştur
        const categoryGenderMap = {};

        categories.forEach((category) => {
          categoryGenderMap[category.id] =
            category.gender || category.genderCode;
        });

        // Ürünleri filtrele
        const filtered = productList.filter((product) => {
          // Ürünün kategorisinin cinsiyet bilgisine bak
          if (product.category_id && categoryGenderMap[product.category_id]) {
            return (
              categoryGenderMap[product.category_id] === selectedGenderFilter
            );
          }
          // Ürünün kendi cinsiyet bilgisi varsa onu kullan
          if (product.gender) {
            return product.gender === selectedGenderFilter;
          }
          return false;
        });

        console.log(
          `Filtreden sonra ${filtered.length} ürün kaldı (cinsiyet: ${selectedGenderFilter})`
        );
        setDisplayedProducts(filtered);
      } else {
        // Filtre yoksa tüm ürünleri göster
        setDisplayedProducts(productList);
      }
    }
  }, [productList, categories, selectedGenderFilter]);

  // Gender change handler - Bu fonksiyonu da güncelliyoruz
  const handleGenderChange = (gender) => {
    console.log("Cinsiyet filtreleme:", gender);

    // Redux state güncelle
    dispatch(setGenderFilter(gender === "all" ? null : gender));

    // Yerel state güncelle
    setSelectedGenderFilter(gender);

    // Sayfa 1'e dön
    setPage(1);

    // Doğru URL'e git
    const newUrl =
      gender === "all"
        ? "/shop"
        : `/shop/${gender === "k" ? "kadin" : "erkek"}`;

    history.push(newUrl);

    // Kategori seçimini sıfırla (cinsiyet değişirse)
    if (categoryId) {
      setSelectedCategory("All");
    }

    // Yeni veri getir
    const params = {
      limit: 12,
      offset: 0,
    };

    // API çağrısında gender parametresi gönder
    if (gender !== "all") {
      params.gender = gender;
    }

    console.log("API çağrısı yapılıyor:", params);
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

  // Apply filters with API call
  const applyFilters = () => {
    const params = {
      limit: 12,
      offset: (page - 1) * 12,
    };

    if (selectedCategory !== "All") params.category_id = selectedCategory;
    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (filterText) params.filter = filterText;
    if (sortOption !== "featured") params.sort = sortOption;
    if (priceValues[0] > (priceRange?.min || 0))
      params.priceMin = priceValues[0];
    if (priceValues[1] < (priceRange?.max || 1000))
      params.priceMax = priceValues[1];

    console.log("Filtreler uygulanıyor:", params);
    dispatch(fetchProducts(params));
  };

  // Update the handlePageChange function
  const handlePageChange = (newPage) => {
    // Update page state
    setPage(newPage);
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  
    // Calculate the correct offset based on the page number
    const offset = (newPage - 1) * 12;
    
    // Build parameters object with all current filters
    const params = {
      limit: 12,
      offset: offset,
    };
  
    // Apply any active filters
    if (selectedGenderFilter !== "all") params.gender = selectedGenderFilter;
    if (selectedCategory !== "All") params.category_id = selectedCategory;
    if (filterText) params.filter = filterText;
    if (sortOption !== "featured") params.sort = sortOption;
    if (priceValues[0] > (priceRange?.min || 0)) params.priceMin = priceValues[0];
    if (priceValues[1] < (priceRange?.max || 1000)) params.priceMax = priceValues[1];
  
    // Log the pagination params to help with debugging
    console.log(`Fetching page ${newPage} with offset:`, offset);
    console.log("API parameters:", params);
    
    // Dispatch the action to fetch products with the updated parameters
    dispatch(fetchProducts(params));
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
    if (category.id === "all") {
      setSelectedCategory("All");

      const url =
        selectedGenderFilter !== "all"
          ? `/shop/${selectedGenderFilter === "k" ? "kadin" : "erkek"}`
          : "/shop";

      history.push(url);
    } else {
      setSelectedCategory(category.id);
      const genderCode = category.gender || category.genderCode || "e";
      const genderText = genderCode === "k" ? "kadin" : "erkek";

      const slug =
        category.slug ||
        category.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      history.push(`/shop/${genderText}/${slug}/${category.id}`);
    }

    const params = { limit: 12, offset: 0 };

    if (category.id !== "all") {
      params.category_id = category.id;

      if (category.gender || category.genderCode) {
        const genderCode = category.gender || category.genderCode;
        params.gender = genderCode;
        setSelectedGenderFilter(genderCode);
      }
    }

    dispatch(fetchProducts(params));
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

      {/* Gender Filter */}
      <section className="mb-8">
        <GenderFilter
          selectedGenderFilter={selectedGenderFilter}
          title={pageTitle}
          onGenderChange={handleGenderChange}
        />
      </section>

      {/* Mobile filter button */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors hover:bg-gray-50"
        >
          <Filter className="mr-2 h-5 w-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar with filters */}
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

        {/* Product grid */}
        <main className="col-span-12 md:col-span-9">
          <ProductToolbar
            displayedProducts={displayedProducts}
            total={total}
            sortOption={sortOption}
            setSortOption={setSortOption}
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
    </div>
  );
}

export default Shop;
