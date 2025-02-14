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
    <div className="container flex flex-col items-center mx-auto p-4">
      <h1 className="text-xl text-center font-bold text-[#252B42]">
        BESTSELLERS PRODUCTS
      </h1>
      <p className="text-center pb-12">
        Problems trying to resolve <br /> the conflict between
      </p>
      <div className="flex flex-col space-y-12 md:flex-row md:space-x-4 md:space-y-0">
        {products.map((product) => (
          <div
            className="flex flex-col justify-center gap-4 items-center text-center"
            key={product.id}
          >
            <img src={product.image} alt={product.name} />
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-bold">${product.price}</p>
          </div>
        ))}
      </div>
      <button className="mt-4 py-4 px-6 bg-white border-sky-500 border-2 text-blue-500 rounded">
        Load More Products
      </button>
    </div>
  );
}

export default BestSellerProducts;
