import React from 'react';
import ProductCard from './ProductCard';

const RelatedProducts = ({ relatedProducts }) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
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
  );
};

export default RelatedProducts;