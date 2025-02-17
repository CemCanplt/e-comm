import BestSellerProducts from "./content/BestSellerProducts";
import ExploringCards from "./content/ExploringCards";
import FeaturedProducts from "./content/FeaturedProducts";
import PracticeAdvice from "./content/PracticeAdvice";
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
      <PracticeAdvice />
    </>
  );
}

export default PageContent;
