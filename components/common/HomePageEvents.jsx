"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";


export default function HomePageEvents() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);
  const router = useRouter();
 
  const images = [
    "/testimages/n1.jpg",
    "/testimages/n2.jpg",
    "/testimages/n3.jpg",
    "/testimages/n4.jpg",
  ];

  const totalItems = images.length;
  const extendedImages = [...images, ...images, ...images]; // Triple the images for seamless looping

  // Set initial index to the middle set and handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
      setCurrentIndex(totalItems); // Start in the middle set
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalItems]);

  // Handle infinite loop by resetting index without animation
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex >= totalItems * 2) {
        setIsTransitioning(false);
        setCurrentIndex(totalItems); // Reset to middle set
      } else if (currentIndex <= 0) {
        setIsTransitioning(false);
        setCurrentIndex(totalItems); // Reset to middle set
      }
    };

    const slider = sliderRef.current;
    slider.addEventListener("transitionend", handleTransitionEnd);
    return () =>
      slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, totalItems]);

  // Re-enable transitions after instant reset
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

  const slideRight = () => setCurrentIndex((prev) => prev - 1);
  const slideLeft = () => setCurrentIndex((prev) => prev + 1);

  const getTransformStyle = () => {
    const offset = (currentIndex * 100) / itemsPerView;
    return {
      transform: `translateX(-${offset}%)`,
      transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
    };
  };

  return (
    <div className="flex flex-col items-center justify-center pt-4 border-b border-white">
      <div className="text-center select-none">
        <h1 className="font-mitra text-4xl mt-4">رویداد ها</h1>
      </div>
      <div className="flex items-center h-auto w-full p-8">
        <FaChevronLeft
          className="text-secondery text-4xl cursor-pointer hover:scale-110 transition"
          onClick={slideLeft}
        />
        <div className="w-full overflow-hidden select-none">
          <div className="flex" style={getTransformStyle()} ref={sliderRef}>
            {extendedImages.map((src, index) => (
              <div
                key={index}
                className="flex-none w-full cursor-pointer sm:w-1/2 lg:w-1/4 p-2"
                style={{ width: `${100 / itemsPerView}%` }}
                onClick={()=>{ router.push("/courses")}}
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
        <FaChevronRight
          className="text-secondery text-4xl cursor-pointer hover:scale-110 transition"
          onClick={slideRight}
        />
      </div>
    </div>
  );
}
