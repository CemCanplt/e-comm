import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFetchState } from "../../store/reducers/productReducer";
import { useShopFilter } from "./ShopFilterContext";
import { fetchProducts } from "../../store/actions/productActions";

const ShopURLSync = () => {
  const { gender, categorySlug, categoryId } = useParams();
  const dispatch = useDispatch();
  const { 
    setSelectedGenderFilter, 
    setSelectedCategory 
  } = useShopFilter();

  // URL parametrelerini izle ve filtre state'ini güncelle
  useEffect(() => {
    dispatch(setFetchState("FETCHING"));

    if (gender) {
      const genderCode = gender === "kadin" ? "k" : "e";
      setSelectedGenderFilter(genderCode);
    } else {
      setSelectedGenderFilter("all");
    }

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
  }, [dispatch, gender, categoryId, setSelectedGenderFilter, setSelectedCategory]);

  return null; // Bu bileşen render olmaz
};

export default ShopURLSync;