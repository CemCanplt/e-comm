import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { setCard } from "../store/reducers/shoppingCardReducer";
import { toast } from "react-toastify";

// Import modular components
import ProductBreadcrumb from "./product/ProductBreadcrumb";
import ProductImages from "./product/ProductImages";
import ProductInfo from "./product/ProductInfo";
import ProductActions from "./product/ProductActions";
import ProductTabs from "./product/ProductTabs";
import ProductCard from "./product/ProductCard";
import RelatedProducts from "./product/RelatedProducts";

function ProductDetail() {
  // URL parameters
  const { gender, categorySlug, productId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { card } = useSelector((state) => state.shoppingCard);
  const { items: categories } = useSelector((state) => state.categories);

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      // Debug URL parameters
      console.log("URL Parameters:", { gender, categorySlug, productId });

      if (!productId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch product data
        const productResponse = await axios.get(
          `https://workintech-fe-ecommerce.onrender.com/products/${productId}`
        );

        let productData = productResponse.data;

        if (!productData) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        // Process images
        if (productData.images) {
          if (typeof productData.images === "string") {
            try {
              productData.images = JSON.parse(productData.images);
            } catch (e) {
              productData.images = [productData.images];
            }
          }

          // If images is array of objects, extract URLs
          if (
            Array.isArray(productData.images) &&
            productData.images[0] &&
            typeof productData.images[0] === "object"
          ) {
            productData.images = productData.images.map((img) => img.url || "");
          }
        } else if (productData.image) {
          productData.images = [productData.image];
        } else {
          productData.images = [
            "https://placehold.co/300x300/gray/white?text=No+Image",
          ];
        }

        // Get category info from Redux store
        if (productData.category_id) {
          const categoryInfo = categories.find(
            (cat) => cat.id === productData.category_id
          );

          if (categoryInfo) {
            productData.category = categoryInfo.title;
            productData.gender = categoryInfo.genderCode;
            productData.category_slug = categoryInfo.slug;

            // Only update URL if we came from a simple URL
            if (!gender && !categorySlug) {
              const urlGender = categoryInfo.genderText;
              const urlCategorySlug = categoryInfo.slug;
              history.replace(
                `/product/${urlGender}/${urlCategorySlug}/${productId}`
              );
            }

            // Fetch related products
            const relatedResponse = await axios.get(
              `https://workintech-fe-ecommerce.onrender.com/products?category_id=${productData.category_id}&limit=4`
            );

            setRelatedProducts(
              relatedResponse.data.products.filter(
                (p) => p.id !== parseInt(productId)
              )
            );
          }
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, gender, categorySlug, history, categories]);

  const handleAddToCard = () => {
    // Check if item already exists in cart
    const existingItem = card.find((item) => item.id === product.id);

    let updatedCard;
    if (existingItem) {
      // Update quantity if already in card
      updatedCard = card.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      toast.info(`Updated ${product.name} quantity in card`);
    } else {
      // Add new item to card
      updatedCard = [
        ...card,
        {
          id: product.id,
          name: product.name,
          price: product.discount_price || product.price,
          image: product.images?.[0] || product.image,
          quantity: quantity,
          category: product.category,
          category_id: product.category_id,
          description: product.description?.substring(0, 100),
        },
      ];
      toast.success(`Added ${product.name} to card`);
    }

    dispatch(setCard(updatedCard));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Error Loading Product
        </h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => history.goBack()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="inline-block mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb navigation */}
        <ProductBreadcrumb product={product} />

        {/* Product Info Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Mobile View */}
          <div className="md:hidden p-4">
            <div className="space-y-6">
              {/* Mobile Product Images */}
              <ProductImages
                product={product}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isMobile={true}
              />

              {/* Mobile Product Info */}
              <ProductInfo product={product} isMobile={true} />

              {/* Mobile Product Actions (Quantity selector & Add to cart) */}
              <ProductActions
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCard={handleAddToCard}
                isMobile={true}
              />
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex flex-wrap p-8">
            {/* Desktop Product Images */}
            <ProductImages
              product={product}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />

            {/* Desktop Product Info - now includes quantity selector and Add to Card button */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCard={handleAddToCard}
            />
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Related Products */}
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}

export default ProductDetail;
