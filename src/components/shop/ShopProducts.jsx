import React from "react";
import { useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import ProductToolbar from "./ProductToolbar";
import LoadingSpinner from "../common/LoadingSpinner";

const ShopProducts = ({
  loading,
  filters,
  handleSortChange,
  handlePageChange,
  resetFilters,
}) => {
  const { productList, total } = useSelector((state) => state.product);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <LoadingSpinner message="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductToolbar
        total={total}
        sortOption={filters.sort}
        onSortChange={handleSortChange}
      />

      <ProductGrid
        products={productList}
        totalPages={Math.ceil(total / 12)}
        currentPage={filters.page}
        onPageChange={handlePageChange}
        onResetFilters={resetFilters}
        filterText={filters.text}
      />
    </div>
  );
};

export default ShopProducts;
