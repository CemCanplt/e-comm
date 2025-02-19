const products = [
  {
    id: 1,
    name: "Ürün 1",
    description: "Bu ürün 1'in açıklamasıdır.",
    price: 19.99,
    image: "https://placehold.co/200x300/orange/white",
  },
  {
    id: 2,
    name: "Ürün 2",
    description: "Bu ürün 2'nin açıklamasıdır.",
    price: 29.99,
    image: "https://placehold.co/200x300/blue/white",
  },
  {
    id: 3,
    name: "Ürün 3",
    description: "Bu ürün 3'ün açıklamasıdır.",
    price: 39.99,
    image: "https://placehold.co/200x300/green/white",
  },
  {
    id: 4,
    name: "Ürün 4",
    description: "Bu ürün 4'ün açıklamasıdır.",
    price: 49.99,
    image: "https://placehold.co/200x300/red/white",
  },
];

function BestSellerProducts() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl text-center font-bold text-(--Bandage-Rengi) mb-4">
          BESTSELLERS PRODUCTS
        </h1>
        <p className="text-center text-(--ikinci-metin-rengi) mb-12">
          Problems trying to resolve the conflict between
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center text-center p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover mb-4"
              />
              <h2 className="font-bold mb-2">{product.name}</h2>
              <p className="mb-2">{product.description}</p>
              <p className="font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestSellerProducts;
