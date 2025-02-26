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
      try {
        // Fetch product data
        const response = await axios.get(
          `https://workintech-fe-ecommerce.onrender.com/products/${productId}`
        );

        const productData = response.data;

        // Get category info
        if (productData.category_id) {
          // Fetch all categories
          const categoriesResponse = await axios.get(
            "https://workintech-fe-ecommerce.onrender.com/categories"
          );

          // Find product's category
          const categoryInfo = categoriesResponse.data.find(
            (cat) => cat.id === productData.category_id
          );

          // Update URL with correct information
          if (categoryInfo) {
            // Add category info to product data
            productData.category = categoryInfo.title;

            // Determine gender and slug from category code
            const code = categoryInfo.code || "";
            const codeParts = code.split(":");

            const genderCode = codeParts[0] || "";
            const categorySlug =
              codeParts[1] ||
              categoryInfo.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            // Set gender info
            productData.gender = genderCode;
            const genderText = genderCode === "k" ? "kadin" : "erkek";

            // Create correct URL path
            const correctPath = `/product/${genderText}/${categorySlug}/${productId}`;

            // Update URL if necessary
            if (history.location.pathname !== correctPath) {
              history.replace(correctPath);
            }
          }
        }

        // Process images data
        if (productData.images) {
          if (typeof productData.images === "string") {
            try {
              productData.images = JSON.parse(productData.images);
            } catch (e) {
              productData.images = [productData.images];
            }
          } else if (Array.isArray(productData.images)) {
            // Extract URLs if images are objects
            if (
              productData.images[0] &&
              typeof productData.images[0] === "object"
            ) {
              productData.images = productData.images.map(
                (img) => img.url || ""
              );
            }
          }
        } else if (productData.image) {
          productData.images = [productData.image];
        } else {
          productData.images = [
            "https://placehold.co/300x300/gray/white?text=No+Image",
          ];
        }

        setProduct(productData);

        // Fetch related products by category
        if (response.data.category_id) {
          const relatedResponse = await axios.get(
            `https://workintech-fe-ecommerce.onrender.com/products?category_id=${response.data.category_id}&limit=4`
          );
          setRelatedProducts(
            relatedResponse.data.products.filter(
              (p) => p.id !== parseInt(productId)
            )
          );
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setQuantity(1);
  }, [productId, history]);

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

            {/* Desktop Product Info */}
            <ProductInfo product={product} />

            {/* Desktop Product Actions */}
            <div className="w-full md:w-1/2 pl-4">
              <ProductActions
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCard={handleAddToCard}
              />
            </div>
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
