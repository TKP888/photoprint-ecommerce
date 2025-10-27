"use client";
import { useState } from "react";

interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: "1",
    imageUrl: "/images/hero/Hero-2.jpg",
    title: "Crafted Prints, Thoughtful Design",
    subtitle:
      "Fine art printing, mounting and framing, handled with care from start to finish.",
  },
  {
    id: "2",
    imageUrl: "/images/hero/Hero-1.jpg",
    title: "Print. Frame. Display.",
    subtitle:
      "High-quality art prints and professional photo services for homes, studios and businesses",
  },
  {
    id: "3",
    imageUrl: "/images/hero/Hero-3.jpg",
    title: "Best Sellers",
    subtitle:
      "Discover the artworks and photo prints that have become modern classics",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  return (
    <section className="relative h-96 md:h-[800px] flex items-center justify-center overflow-hidden">
      {" "}
      <div
        key={currentSlide}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url('${slides[currentSlide].imageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </div>
      <div className="relative z-10 bg-black py-4 px-4 text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl">{slides[currentSlide].subtitle}</p>
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white bg-opacity-50 w-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
