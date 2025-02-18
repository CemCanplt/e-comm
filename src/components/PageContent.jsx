import BestSellerProducts from "./content/BestSellerProducts";
import ExploringCards from "./content/ExploringCards";
import FeaturedProducts from "./content/FeaturedProducts";
import PracticeAdvice from "./content/PracticeAdvice";
import ShoppingLinks from "./content/ShoppingLinks";
import Slider from "./content/Slider";

function PageContent() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-[1920px] mx-auto">
      <main className="flex-grow">
        <div className="w-full">
          <Slider />
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <section className="my-12">
            <ShoppingLinks />
          </section>

          <section className="my-12">
            <ExploringCards />
          </section>

          <section className="my-12">
            <BestSellerProducts />
          </section>

          <section className="my-12">
            <FeaturedProducts />
          </section>

          <section className="my-12">
            <PracticeAdvice />
          </section>
        </div>
      </main>
    </div>
  );
}

export default PageContent;
