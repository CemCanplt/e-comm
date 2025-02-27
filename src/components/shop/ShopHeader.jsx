import React from "react";
import ShopBreadcrumb from "./ShopBreadcrumb";
import GenderFilter from "./GenderFilter";

const ShopHeader = ({
  gender,
  categorySlug,
  categories,
  selectedGenderFilter,
  handleGenderChange,
}) => {
  // Page title based on gender
  const pageTitle = gender
    ? gender === "kadin"
      ? "Women's Collection"
      : "Men's Collection"
    : "All Products";

  // Get selected category object from categories array
  const selectedCategoryObj =
    categorySlug && categories?.length > 0
      ? categories.find(
          (cat) =>
            cat.slug === categorySlug ||
            cat.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "") === categorySlug
        )
      : null;

  return (
    <>
      <ShopBreadcrumb
        gender={gender}
        categorySlug={categorySlug}
        category={selectedCategoryObj}
      />

      <section className="mb-8">
        <GenderFilter
          selectedGenderFilter={selectedGenderFilter}
          title={pageTitle}
          onGenderChange={handleGenderChange}
        />
      </section>
    </>
  );
};

export default ShopHeader;
