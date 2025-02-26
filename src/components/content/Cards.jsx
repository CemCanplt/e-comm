function Cards({ kart }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl 
      max-w-sm mx-auto md:max-w-2xl lg:max-w-4xl xl:flex"
    >
      {/* Resim Container */}
      <div className="relative h-64 md:h-72 xl:h-auto xl:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
          style={{ backgroundImage: `url(${kart.resim})` }}
        >
          {/* Yeni Tag */}
          <div
            className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-sm 
            font-bold px-3 py-1 rounded-full shadow-lg"
          >
            NEW
          </div>

          {/* Aksiyon Butonları */}
          <div
            className="absolute bottom-4 right-4 flex space-x-3 transition-opacity duration-300 
            opacity-0 group-hover:opacity-100"
          >
            {/* Butonlar için ortak class */}
            {["card", "favorite", "compare"].map((action) => (
              <button
                key={action}
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg 
                  backdrop-blur-sm flex items-center justify-center transform transition 
                  hover:scale-110 hover:shadow-xl"
                aria-label={action}
              >
                {/* İkonlar buraya */}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6 space-y-4 xl:w-1/2 xl:p-8">
        {/* Etiketler */}
        <div className="flex flex-wrap gap-2">
          {kart.kategori?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 
                rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Başlık */}
        <h3
          className="text-xl font-bold text-gray-800 hover:text-indigo-600 
          transition duration-300 cursor-pointer"
        >
          {kart.baslik}
        </h3>

        {/* İçerik */}
        <p className="text-gray-600 text-sm leading-relaxed">{kart.icerik}</p>

        {/* Renk ve Boyut Seçenekleri */}
        <div className="space-y-4 py-4 border-t border-gray-100">
          {/* Renk Seçenekleri */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Available Colors
            </p>
            <div className="flex items-center gap-3">
              <button
                className="w-6 h-6 rounded-full bg-[#23A6F0] ring-2 ring-offset-2 
                  ring-transparent hover:ring-[#23A6F0] focus:ring-[#23A6F0] transition-all"
                aria-label="Select blue color"
              />
              <button
                className="w-6 h-6 rounded-full bg-[#2DC071] ring-2 ring-offset-2 
                  ring-transparent hover:ring-[#2DC071] focus:ring-[#2DC071] transition-all"
                aria-label="Select green color"
              />
              <button
                className="w-6 h-6 rounded-full bg-[#E77C40] ring-2 ring-offset-2 
                  ring-transparent hover:ring-[#E77C40] focus:ring-[#E77C40] transition-all"
                aria-label="Select orange color"
              />
              <button
                className="w-6 h-6 rounded-full bg-[#252B42] ring-2 ring-offset-2 
                  ring-transparent hover:ring-[#252B42] focus:ring-[#252B42] transition-all"
                aria-label="Select black color"
              />
            </div>
          </div>

          {/* Boyut Seçenekleri */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Select Size</p>
            <div className="flex items-center gap-2">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="min-w-[2.5rem] h-8 px-2 rounded-lg bg-gray-100 text-sm font-medium 
                    text-gray-700 hover:bg-gray-200 focus:bg-gray-200 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alt Bilgiler */}
        <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100">
          {/* Tarih ve Yorum Bilgileri */}
          <div className="flex items-center text-gray-500">
            <span className="text-sm">{kart.tarih}</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{kart.yorum} comments</span>
          </div>

          {/* Learn More Butonu */}
          <button
            className="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white 
            bg-[var(--ilk-renk)] hover:bg-blue-600 rounded-full transform 
            transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
