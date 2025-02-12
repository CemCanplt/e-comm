function EverySliderPage({ data }) {
  return (
    <>
      <div className="w-full flex-shrink-0 relative">
        {/* Resim */}
        <img src={data.link} alt={data.title} className="w-full h-auto" />

        {/* Resim Üzerindeki İçerik */}
        <div className="absolute inset-0 flex flex-col items-center text-center gap-20 bg-opacity-50 text-white p-4">
          <h2 className="text-3xl font-bold mb-4">{data.title}</h2>
          <p className="text-lg mb-6">{data.description}</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            {data.buttonText}
          </button>
        </div>
      </div>
    </>
  );
}

export default EverySliderPage;
