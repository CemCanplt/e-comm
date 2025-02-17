const nitelikler = [
  {
    logo: "https://placehold.co/72x72/pink/FFF",
    title: "Easy Wins",
    metin: "Get your best looking smile now!",
  },
  {
    logo: "https://placehold.co/72x72/green/FFF",
    title: "Concrete",
    metin:
      "Defalcate is most focused in helping you discover your most beautiful smile",
  },
  {
    logo: "https://placehold.co/72x72/black/white",
    title: "Hack Growth",
    metin: "Overcame any hurdle or any other problem.",
  },
];

function FeaturedProducts() {
  return (
    <div className="flex font-(--Bandage-Fontu) lg:items-center md:text-center md: flex-col gap-10 px-10 py-10 md:px-20">
      <div className="flex flex-col items-center gap-5 xl:flex-row xl:justify-between xl:px-20">
        <div className="flex flex-col items-center gap-5 xl:order-2 xl:max-w-120 ">
          <p className="text-sky-500">Featured Products</p>
          <h1 className="text-2xl font-bold">We love what we do</h1>
          <p className="text-(--ikinci-metin-rengi) xl:text-left">
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics.
            <br />
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics.
          </p>
        </div>
        <div className="flex flex-row justify-center gap-2 lg:order-1 ">
          <img src="https://placehold.co/158x363/green/FFF" alt="" />
          <img src="https://placehold.co/204x363/orange/FFF" alt="" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-20 md:py-10 md:">
        <div className="flex text-center flex-col items-center gap-2">
          <h2 className="text-(--ikinci-metin-rengi)">Featured Products</h2>
          <h1 className="text-2xl font-bold text-(--Bandage-Rengi)">
            THE BEST SERVICES
          </h1>
          <p className="tex-center text-(--ikinci-metin-rengi)">
            Problems trying to resolve the conflict between{" "}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-start gap-10">
          {nitelikler.map((nitelik, i) => {
            return (
              <div
                key={i}
                className="flex grow-1 flex-col items-center justify-center max-w-72 gap-5 "
              >
                <img src={nitelik.logo} alt="" />
                <h2 className="text-xl font-bold">{nitelik.title}</h2>
                <p className="text-center text-(--ikinci-metin-rengi)">
                  {nitelik.metin}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProducts;
