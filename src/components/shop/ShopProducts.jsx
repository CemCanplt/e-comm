import React from "react";
import { useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import ProductToolbar from "./ProductToolbar";
import LoadingSpinner from "../common/LoadingSpinner";

const ShopProducts = ({
  filters,
  ui = {}, // Provide a default empty object
  handleSortChange,
  handlePageChange,
  resetFilters,
  selectedGenderFilter,
  sortOption,
  viewMode = "grid", // Provide a default value
  setViewMode,
  filterText,
}) => {
  const {
    productList = [],
    total = 0,
    fetchState,
  } = useSelector((state) => state.product);
  const { categories = [] } = useSelector((state) => state.categories);

  return (
    <main className="col-span-12 md:col-span-9">
      <ProductToolbar
        total={total}
        sortOption={sortOption || "featured"}
        setSortOption={handleSortChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {fetchState === "FETCHING" ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <LoadingSpinner message="Loading products..." />
        </div>
      ) : (
        <ProductGrid
          products={productList}
          viewMode={viewMode}
          isLoading={fetchState === "FETCHING"}
          totalPages={Math.ceil(total / 12)}
          page={filters?.page || 1}
          handlePageChange={handlePageChange}
          resetFilters={resetFilters}
          selectedGenderFilter={selectedGenderFilter || "all"}
          filterText={filterText || ""}
          categories={categories}
        />
      )}
    </main>
  );
};

export default ShopProducts;
