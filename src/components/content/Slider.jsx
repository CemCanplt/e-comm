import { useEffect, useState } from "react";
import EverySliderPage from "./EverySliderPage";

// Resimler ve metinler
const images = [
  {
    title: "Başlık 1",
    description: "Bu bir açıklama metni. Resim 1 için açıklama.",
    buttonText: "Buton 1",
    link: "https://placehold.co/388x904/orange/FFF",
  },
  {
    title: "Başlık 2",
    description: "Bu bir açıklama metni. Resim 2 için açıklama.",
    buttonText: "Buton 2",
    link: "https://placehold.co/388x904",
  },
  {
    title: "Başlık 3",
    description: "Bu bir açıklama metni. Resim 3 için açıklama.",
    buttonText: "Buton 3",
    link: "https://placehold.co/388x904/green/FFF",
  },
];

function Slider() {
  // Mevcut resmin indeksini tutan state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Kaydırma işlemi için başlangıç pozisyonu
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Bir sonraki resme geçme fonksiyonu
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Bir önceki resme geçme fonksiyonu
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Dokunmatik başlangıç olayı
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Dokunmatik hareket olayı
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Dokunmatik bitiş olayı
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Sağa kaydırma (sonraki resim)
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Sola kaydırma (önceki resim)
      prevSlide();
    }
  };

  // Otomatik geçiş efekti
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 3 saniyede bir geçiş

    return () => clearInterval(interval); // Temizleme
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Slider Container */}
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Resimler ve İçerikler */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((data, index) => (
            <EverySliderPage key={index} data={data} />
          ))}
        </div>
      </div>

      {/* Slider İndikatörleri/Göstergeleri */}
      <div className="flex space-x-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
