import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import pic4 from "../../assets/pic4.png";
import pic5 from "../../assets/pic5.png";

function Hero() {

  const images = [pic1, pic2, pic3, pic4, pic5];

  const slides = [...images, images[0]];

  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);

  }, [current]);

  useEffect(() => {

    if (current === images.length) {

      setTimeout(() => {

        setTransition(false);
        setCurrent(0);

      }, 700);

      setTimeout(() => {
        setTransition(true);
      }, 750);
    }

  }, [current, images.length]);

  const nextSlide = () => {
    setCurrent((prev) => prev + 1);
  };

  const prevSlide = () => {

    if (current === 0) {

      setTransition(false);

      setCurrent(images.length - 1);

      setTimeout(() => {
        setTransition(true);
      }, 50);

    } else {

      setCurrent((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-800
          shadow-xl
          bg-[#020817]
          shadow-[0_10px_40px_rgba(34,197,94,0.15)]
        "
      >

        <div
          className={`flex ${
            transition
              ? "transition-transform duration-700 ease-in-out"
              : ""
          }`}
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >

          {slides.map((image, index) => (

            <img
              key={index}
              src={image}
              alt={`Banner ${index + 1}`}
              className="w-full flex-shrink-0"
            />

          ))}

        </div>

        {/* Previous */}

        <button
          onClick={prevSlide}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            w-9
            h-9
            rounded-full
            bg-black/50
            backdrop-blur-md
            text-white
            hover:bg-green-500
            hover:text-black
            hover:scale-110
            active:scale-95
            transition-all
            duration-300
            flex
            items-center
            justify-center
            z-10
          "
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next */}

        <button
          onClick={nextSlide}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            w-9
            h-9
            rounded-full
            bg-black/50
            backdrop-blur-md
            text-white
            hover:bg-green-500
            hover:text-black
            hover:scale-110
            active:scale-95
            transition-all
            duration-300
            flex
            items-center
            justify-center
            z-10
          "
        >
          <ChevronRight size={20} />
        </button>

      </div>

      {/* Dots */}

      <div className="flex justify-center gap-3 mt-4">

        {images.map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 ${
              current % images.length === index
                ? "w-8 h-2 bg-green-500 rounded-full"
                : "w-2 h-2 bg-slate-500 rounded-full hover:bg-slate-300"
            }`}
          />

        ))}

      </div>

    </div>
  );
}

export default Hero;