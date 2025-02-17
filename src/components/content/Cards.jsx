function Cards({ kart }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm md:max-w-none xl:flex">
      {/* Resim */}
      <div
        className="relative h-48 xl:h-auto xl:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${kart.resim})` }}
      >
        {" "}
        {/* Örnek bir resim URL'i */}
        <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
          NEW
        </span>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center">
            {/* Sepete Ekle İkonu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3a3 3 0 01-3-3H6.75m12.75 3a3 3 0 003-3H16.5m-12.75 3a3 3 0 01-3 3v2.25A.75.75 0 004.5 21h15A.75.75 0 0020.25 19.5v-2.25m-12.75 3h15.75a.75.75 0 00.75-.75V12.75a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v6A.75.75 0 006.75 21z"
              />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center">
            {/* Favorilere Ekle İkonu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 18 3.75zm0 0h-1.124c0-2.905-2.426-5.25-5.424-5.25-2.648 0-4.875 1.92-5.375 4.5C7.924 9.92 5.5 12.25 5.5 15.156c0 2.905 2.426 5.25 5.424 5.25C13.076 20.406 15.303 18.48 15.803 15.974l1.124-2.828h.576c0 2.905 2.426 5.25 5.424 5.25 3 0 5.424-2.344 5.424-5.25 0-2.905-2.426-5.25-5.424-5.25C18.676 6.33 16.25 4 13.602 4.5c-.5 2.58-2.727 4.5-5.375 4.5H7.376"
              />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center">
            {/* Karşılaştırma İkonu */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.375a1.5 1.5 0 00-1.5 1.5v12.75a1.5 1.5 0 001.5 1.5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6 xl:w-1/2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <span className="bg-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600">
              Google
            </span>
            <span className="bg-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600">
              Trending
            </span>
            <span className="bg-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600">
              New
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition duration-300">
          {kart.baslik}
        </h3>

        <p className="text-gray-600 mt-2 text-sm">{kart.icerik}</p>

        {/* Renk Seçenekleri */}
        <div className="mt-4">
          <p className="text-gray-700 text-sm font-medium">Renk Seçenekleri:</p>
          <div className="flex items-center space-x-2 mt-2">
            <button className="w-6 h-6 rounded-full bg-red-500 hover:shadow-md"></button>
            <button className="w-6 h-6 rounded-full bg-blue-500 hover:shadow-md"></button>
            <button className="w-6 h-6 rounded-full bg-green-500 hover:shadow-md"></button>
            {/* Daha fazla renk eklenebilir */}
          </div>
        </div>

        {/* Boyut Seçenekleri */}
        <div className="mt-4">
          <p className="text-gray-700 text-sm font-medium">
            Boyut Seçenekleri:
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <button className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded hover:bg-gray-300">
              S
            </button>
            <button className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded hover:bg-gray-300">
              M
            </button>
            <button className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded hover:bg-gray-300">
              L
            </button>
            {/* Daha fazla boyut eklenebilir */}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600 text-sm">22 April 2021</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"
              />
            </svg>
            <span className="text-gray-600 text-sm">10 comments</span>
          </div>
        </div>

        <a
          href="#"
          className="inline-block mt-6 bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

export default Cards;
