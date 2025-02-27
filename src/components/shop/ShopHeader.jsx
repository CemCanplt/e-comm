import ShopBreadcrumb from "./ShopBreadcrumb";
import GenderFilter from "./GenderFilter";

const ShopHeader = ({
  gender,
  selectedGender,
  onGenderChange,
  categories,
  categorySlug,
}) => {
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

  const title =
    selectedGender === "k"
      ? "Women's Collection"
      : selectedGender === "e"
      ? "Men's Collection"
      : "All Products";

  return (
    <>
      <ShopBreadcrumb
        gender={gender}
        categorySlug={categorySlug}
        category={selectedCategoryObj}
      />

      <GenderFilter
        selectedGenderFilter={selectedGender === null ? "all" : selectedGender}
        title={title}
        onGenderChange={onGenderChange}
      />
    </>
  );
};

export default ShopHeader;
