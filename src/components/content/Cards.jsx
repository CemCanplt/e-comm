function Cards({ kart }) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
        {/* Resim */}
        <div
          className="relative h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${kart.resim})` }}
        >
          {" "}
          {/* Örnek bir resim URL'i */}
          <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
            NEW
          </span>
        </div>

        {/* İçerik */}
        <div className="p-6">
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
    </>
  );
}

export default Cards;
