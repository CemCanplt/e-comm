import BestSellerProducts from "./content/BestSellerProducts";
import ExploringCards from "./content/ExploringCards";
import FeaturedProducts from "./content/FeaturedProducts";
import ShoppingLinks from "./content/ShoppingLinks";
import Slider from "./content/Slider";

function PageContent() {
  return (
    <>
      <Slider />
      <ShoppingLinks />
      <ExploringCards />
      <BestSellerProducts />
      <FeaturedProducts />
    </>
  );
}

export default PageContent;
