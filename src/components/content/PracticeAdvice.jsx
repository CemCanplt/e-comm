import Cards from "./Cards";

const veri = [
  {
    resim: "https://placehold.co/388x200",
    kategori: ["Google", "Trending", "New"],
    baslik: "Loudest à la Madison #1 (L'integral)",
    icerik:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    tarih: "22 April 2021",
    yorum: 10,
  },
  {
    resim: "https://placehold.co/388x200",
    kategori: ["Google", "Trending", "New"],
    baslik: "Loudest à la Madison #1 (L'integral)",
    icerik:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    tarih: "22 April 2021",
    yorum: 10,
  },
];

function PracticeAdvice() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 py-10">
        <p className="text-center text-sky-500">Practice Advice</p>
        <h1 className="text-2xl font-bold text-center">Featured Posts</h1>
      </div>

      <div className="flex flex-col items-center gap-10 px-4 md:px-0 xl:flex-row xl:justify-center xl:space-x-4">
        {veri.map((kart, i) => {
          return <Cards key={i} kart={kart} />;
        })}
      </div>
    </div>
  );
}

export default PracticeAdvice;
