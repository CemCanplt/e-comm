import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";



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
  return (
    <>
      <Swiper spaceBetween={50} slidesPerView={1}>
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative py-8">
              {/* Resim ve içeriği konumlandırmak için */}
              <img className="m-auto rounded-xl" src={image.link} alt="" />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col px-20 py-10 items-center gap-20 text-center text-white">
                {/* İçeriği ortala ve beyaz yap */}
                <h2 className="text-2xl font-bold mb-4">{image.title}</h2>
                {/* Başlığı biraz daha büyük ve kalın yap */}
                <p className="text-lg text-center max-w-70 mb-6">{image.description}</p>
                {/* Açıklamayı biraz daha büyük yap */}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {image.buttonText}
                </button>
                {/* Butonu stilize et */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </>
  );
}

export default Slider;
