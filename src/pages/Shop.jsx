import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Components
import ProductGrid from "../components/shop/ProductGrid";
import ShopHeader from "../components/shop/ShopHeader";
import FilterBar from "../components/shop/FilterBar";

const Shop = () => {
  const { gender, categoryName, categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtre durumları
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState("");

  const sortOptions = [
    { value: "price:asc", label: "Fiyat (Düşükten Yükseğe)" },
    { value: "price:desc", label: "Fiyat (Yüksekten Düşüğe)" },
    { value: "rating:asc", label: "Puan (Düşükten Yükseğe)" },
    { value: "rating:desc", label: "Puan (Yüksekten Düşüğe)" },
  ];

  // URL'den query parametrelerini al
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");

    if (filter) setFilterText(filter);
    if (sort) setSortOption(sort);
  }, [location.search]);

  // Ürünleri getir
  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (categoryId) params.append("category", categoryId);
    if (filterText) params.append("filter", filterText);
    if (sortOption) params.append("sort", sortOption);

    const queryString = params.toString();
    const url = `${process.env.REACT_APP_API_URL}/products${
      queryString ? `?${queryString}` : ""
    }`;

    axios
      .get(url)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Ürünler yüklenirken bir hata oluştu.");
        setLoading(false);
        console.error("Ürün getirme hatası:", error);
      });
  };

  // Filtre değişikliklerinde URL'i güncelle
  const updateURL = () => {
    const params = new URLSearchParams();

    if (filterText) params.append("filter", filterText);
    if (sortOption) params.append("sort", sortOption);

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
  };

  // Filtre değişikliklerinde
  useEffect(() => {
    updateURL();
    fetchProducts();
  }, [categoryId, filterText, sortOption]);

  const handleFilterChange = (value) => {
    setFilterText(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  return (
    <div className="container mx-auto px-4">
      <ShopHeader gender={gender} categoryName={categoryName} />

      <FilterBar
        filterText={filterText}
        sortOption={sortOption}
        sortOptions={sortOptions}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {error && <div className="text-red-500 text-center my-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
};

export default Shop;
