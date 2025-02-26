import { useEffect, useState } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Heart,
  ShoppingCart as CardIcon,
  ArrowLeft,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  Shield,
} from "lucide-react";
import { setCard } from "../store/reducers/shoppingCardReducer";
import { toast } from "react-toastify";

function ProductDetail() {
  // Update to use the correct URL parameters
  const { gender, categorySlug, productId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { card } = useSelector((state) => state.shoppingCard);

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
        // Ürün verisini çek
        const response = await axios.get(
          `https://workintech-fe-ecommerce.onrender.com/products/${productId}`
        );

        const productData = response.data;

        // Ürünün kategori bilgisini al
        if (productData.category_id) {
          // Tüm kategorileri çek
          const categoriesResponse = await axios.get(
            "https://workintech-fe-ecommerce.onrender.com/categories"
          );

          // Ürünün kategorisini bul
          const categoryInfo = categoriesResponse.data.find(
            (cat) => cat.id === productData.category_id
          );

          // ProductDetail.jsx içinde URL güncelleme kodu

          // Ürün verisi çektikten sonra doğru URL'yi oluşturma
          if (categoryInfo) {
            // Kategori bilgisini ürüne ekle
            productData.category = categoryInfo.title;

            // Code bilgisini kullanarak gender ve slug belirle
            const code = categoryInfo.code || "";
            const codeParts = code.split(":");

            const genderCode = codeParts[0] || "";
            const categorySlug =
              codeParts[1] ||
              categoryInfo.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");

            // Gender bilgisini belirle
            productData.gender = genderCode;
            const genderText = genderCode === "k" ? "kadin" : "erkek";

            // Doğru URL yolu (artık /product ile başlıyor)
            const correctPath = `/product/${genderText}/${categorySlug}/${productId}`;

            // Eğer mevcut URL doğru değilse güncelle
            if (history.location.pathname !== correctPath) {
              history.replace(correctPath);
            }
          }
        }

        // API'den gelen images türünü kontrol et ve düzenle
        if (productData.images) {
          if (typeof productData.images === "string") {
            try {
              productData.images = JSON.parse(productData.images);
            } catch (e) {
              productData.images = [productData.images];
            }
          } else if (Array.isArray(productData.images)) {
            // Her bir image objesi ise url'leri çıkart
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

        // İlgili ürünleri çek - kategori ID'sine göre
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
    // Check if item is already in card
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
          // Store additional product details for better display in card
          category: product.category,
          category_id: product.category_id, // Add category_id for filtering
          description: product.description?.substring(0, 100),
        },
      ];
      toast.success(`Added ${product.name} to card`);
    }

    dispatch(setCard(updatedCard));
  };

  const handleImageChange = (index) => {
    setSelectedImage(index);
  };

  const navigateImage = (direction) => {
    if (!product || !product.images) return;

    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Product Card for related products
  const ProductCard = ({ product }) => {
    // Create SEO-friendly slug from product name
    const slug =
      product.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product";

    // API'den gelen ürün verilerinin tutarlı olması için kontrol et
    const displayImage = () => {
      if (!product)
        return "https://placehold.co/300x300/gray/white?text=No+Image";

      // images bir array ve içerisinde nesneler varsa
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        if (typeof product.images[0] === "object" && product.images[0]?.url) {
          return product.images[0].url;
        }
        return product.images[0]; // string olarak URL
      }

      // Tek bir image property'si varsa
      if (product.image) {
        return product.image;
      }

      return "https://placehold.co/300x300/gray/white?text=No+Image"; // Fallback
    };

    // Fiyat görüntüleme kontrolü
    const displayPrice = () => {
      if (!product) return "$0.00";

      const price = parseFloat(product.price);
      if (isNaN(price)) return "$0.00";

      return `$${price.toFixed(2)}`;
    };

    // İndirimli fiyat görüntüleme kontrolü
    const displayDiscountPrice = () => {
      if (!product || !product.discount_price) return null;

      const discountPrice = parseFloat(product.discount_price);
      if (isNaN(discountPrice)) return null;

      return `$${discountPrice.toFixed(2)}`;
    };

    return (
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md"
        onClick={() => history.push(`/product/${product.id}/${slug}`)}
      >
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={displayImage()}
            alt={product.name || "Product"}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 truncate">
            {product.name || "Product Name"}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div>
              {product.discount_price ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">
                    {displayDiscountPrice()}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    {displayPrice()}
                  </span>
                </div>
              ) : (
                <span className="font-bold">{displayPrice()}</span>
              )}
            </div>
            <div className="text-yellow-400 text-sm">
              {"★".repeat(Math.floor(product.rating || 0))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  // Update any navigation functions within ProductDetail
  // For example, when navigating to related products:
  const navigateToProduct = (product) => {
    // Get gender and category from the product
    const productGender = product.gender === "k" ? "kadin" : "erkek";
    const productCategory =
      product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "kategori";

    history.push(`/shop/${productGender}/${productCategory}/${product.id}`);
  };

  // Update the breadcrumb navigation
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-1">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link to="/shop" className="text-gray-500 hover:text-gray-700">
                Shop
              </Link>
            </li>
            {product?.category && (
              <>
                <li className="text-gray-500">/</li>
                <li>
                  <Link
                    to={`/shop/${
                      product.gender === "k" ? "kadin" : "erkek"
                    }/${product.category
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-500">/</li>
            <li className="text-gray-700 font-medium truncate">
              {product?.name}
            </li>
          </ol>
        </nav>

        {/* Rest of the component... */}
        {/* Product Info Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Mobile View */}
          <div className="md:hidden p-4">
            <div className="space-y-6">
              {/* Product Images */}
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigateImage("prev")}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex space-x-1">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full ${
                        selectedImage === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => navigateImage("next")}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h1 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2">
                  <div className="text-yellow-400">
                    {"★".repeat(Math.floor(product.rating || 0))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating || 0} / 5)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  {product.discount_price ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl text-red-600 font-bold">
                        ${product.discount_price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl text-gray-900 font-bold">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* Product Actions */}
                <div className="space-y-4">
                  {/* Quantity */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center justify-center border rounded-md bg-white shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 py-2.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                      >
                        <span className="text-center">-</span>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 text-center border-x px-0 py-2.5 text-gray-800"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 py-2.5 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-medium"
                      >
                        <span className="text-center">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Add to Card Button */}
                  <button
                    onClick={handleAddToCard}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <CardIcon className="w-5 h-5 mr-2" />
                    Add to Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex flex-wrap p-8">
            {/* Left Column - Images */}
            <div className="w-full md:w-1/2 pr-4 space-y-6">
              {/* Main product image */}
              <div className="aspect-w-4 aspect-h-3 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image gallery */}
              <div className="flex flex-wrap gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-grow-0 flex-shrink-0 basis-[calc(20%-0.6rem)] aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2
                    ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="w-full md:w-1/2 pl-4 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 mt-2">{product.category}</p>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2">
                <div className="text-yellow-400 text-xl">
                  {"★".repeat(Math.floor(product.rating || 0))}
                </div>
                <span className="text-gray-600">
                  ({product.rating || 0} / 5)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                {product.discount_price ? (
                  <div>
                    <span className="text-3xl font-bold text-red-600">
                      ${product.discount_price}
                    </span>
                    <span className="text-xl text-gray-400 line-through ml-2">
                      ${product.price}
                    </span>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm rounded-md">
                      Save $
                      {(product.price - product.discount_price).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl text-gray-900 font-bold">
                    ${product.price}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-gray-600">
                {product.description?.substring(0, 150)}...
              </p>

              {/* Availability */}
              <div className="flex items-center text-green-600">
                <Check size={16} className="mr-2" />
                <span>In Stock</span>
              </div>

              <div className="border-t border-b py-6 flex items-end justify-center flex-wrap">
                {/* Quantity Selector */}
                <div className="w-full md:w-1/2 md:pr-2 mb-4 md:mb-0">
                  <label className="block text-gray-700 mb-2">Quantity:</label>
                  <div className="inline-flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:rounded-md border-r hover:bg-gray-100"
                    >
                      -
                    </button>
                    <p className="px-4">{quantity}</p>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 hover:rounded-md py-2 border-l hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Card Button */}
                <div className="w-full md:w-1/2 md:pl-2">
                  <button
                    onClick={handleAddToCard}
                    className="w-full py-3 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <CardIcon className="w-5 h-5 mr-2" />
                    Add to Card
                  </button>
                </div>
              </div>

              {/* Shipping & Returns Info */}
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 flex items-center mb-2 md:mb-0">
                  <Truck className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Free shipping over $50
                  </span>
                </div>
                <div className="w-full md:w-1/2 flex items-center">
                  <Shield className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    30 days return policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="border-b">
            <div className="flex">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-4 font-medium text-sm focus:outline-none ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Description
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Product Specifications
                </h3>
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 pr-2 border-b py-3">
                    <span className="font-medium text-gray-700">Brand:</span>
                    <span className="float-right text-gray-600">
                      {product.brand || "Unknown"}
                    </span>
                  </div>
                  <div className="w-full md:w-1/2 pl-2 border-b py-3">
                    <span className="font-medium text-gray-700">Material:</span>
                    <span className="float-right text-gray-600">
                      Premium Quality
                    </span>
                  </div>
                  <div className="w-full md:w-1/2 pr-2 border-b py-3">
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="float-right text-gray-600">
                      {product.category || "Uncategorized"}
                    </span>
                  </div>
                  <div className="w-full md:w-1/2 pl-2 border-b py-3">
                    <span className="font-medium text-gray-700">Stock:</span>
                    <span className="float-right text-gray-600">Available</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-2 mb-6">
                  <div className="text-yellow-400 text-xl">
                    {"★".repeat(Math.floor(product.rating || 0))}
                  </div>
                  <span className="text-gray-600">
                    ({product.rating || 0} out of 5)
                  </span>
                </div>
                <p className="text-gray-600">
                  No reviews yet. Be the first to review this product.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="flex flex-wrap -mx-3">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:w-1/2 lg:w-1/4 px-3 mb-6"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
