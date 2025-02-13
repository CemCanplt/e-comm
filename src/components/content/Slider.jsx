// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

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
  return (
    <>
      <Swiper
        className=""
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <img className="mx-auto" src={images[0].link} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img className="mx-auto" src={images[1].link} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img className="mx-auto" src={images[2].link} alt="" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default Slider;
