const exploringCards = [
  {
    background: "https://placehold.co/345x556/orange/FFF",
    Title: "Title",
    butonMetni: "Button",
  },
  {
    background: "https://placehold.co/345x556/orange/FFF",
    Title: "Title",
    butonMetni: "Button",
  },
  {
    background: "https://placehold.co/345x556/orange/FFF",
    Title: "Title",
    butonMetni: "Button",
  },
  {
    background: "https://placehold.co/345x556/orange/FFF",
    Title: "Title",
    butonMetni: "Button",
  },
];

function ExploringCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-100 p-4">
      {exploringCards.map((card, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg">
          <img
            src={card.background}
            alt={card.Title}
            className="w-full h-[556px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="text-white text-xl font-semibold mb-2">
              {card.Title}
            </h2>
            <button
              className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full 
              hover:bg-white hover:text-black transition duration-300 transform hover:-translate-y-1"
            >
              {card.butonMetni}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExploringCards;
