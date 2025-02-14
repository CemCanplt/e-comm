const exploringCards = [
  {
    background: "https://placehold.co/345x556/orange/FFF",
    title: "Card 1 Title",
    buttonText: "Shop Now",
  },
  {
    background: "https://placehold.co/345x556/blue/FFF",
    title: "Card 2 Title",
    buttonText: "Learn More",
  },
  {
    background: "https://placehold.co/345x556/green/FFF",
    title: "Card 3 Title",
    buttonText: "View Details",
  },
  {
    background: "https://placehold.co/345x556/red/FFF",
    title: "Card 4 Title",
    buttonText: "Explore",
  },
];

function ExploringCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-gray-100 p-8">
      {exploringCards.map((card, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg">
          <img
            src={card.background}
            alt={card.title}
            className="w-full h-[556px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-6 bg-gradient-to-t from-blue-500/70 to-transparent">
            <h2 className="text-white text-xl font-semibold mb-2">
              {card.title}
            </h2>
            <button
              className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full 
              hover:bg-white hover:text-black transition duration-300 transform hover:-translate-y-1"
            >
              {card.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExploringCards;
