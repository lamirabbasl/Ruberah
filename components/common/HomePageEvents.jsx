"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function HomePageEvents() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef(null);

  const images = [
    "/testimages/c1.jpg",
    "/testimages/c2.jpg",
    "/testimages/c3.jpg",
    "/testimages/c4.jpg",
    "/testimages/c6.jpg",
  ];

  // Update items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize(); // Set on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideRight = () => {
    if (currentIndex < images.length - itemsPerView) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-4 border-b-1 border-white">
      <div className="text-center select-none">
        <h1 className="font-noto text-4xl mt-4">دوره ها</h1>
      </div>
      <div className="flex items-center h-auto w-full p-8">
        <FaChevronLeft
          className={`text-secondery text-4xl ${
            currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"
          }`}
          onClick={slideLeft}
        />
        <div className="w-full h-full mt-4 overflow-hidden select-none">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {images.map((src, index) => (
              <div
                key={index}
                className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2"
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <FaChevronRight
          className={`text-secondery text-4xl ${
            currentIndex >= images.length - itemsPerView
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-700"
          }`}
          onClick={slideRight}
        />
      </div>
    </div>
  );
}
