"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePageEvents() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);

  const images = [
    "/hero/n1.jpg",
    "/hero/n2.jpg",
    "/hero/n3.jpg",
    "/hero/n4.jpg",
    "/hero/n5.jpg",
    "/hero/n6.jpg",
    "/hero/n7.jpg",
    "/hero/n8.jpg",
  ];

  const totalItems = images.length;
  const extendedImages = [...images, ...images, ...images];

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(5);
      setCurrentIndex(totalItems);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [totalItems]);

  // Handle infinite loop
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex >= totalItems * 2) {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);
      } else if (currentIndex <= 0) {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);
      }
    };

    const slider = sliderRef.current;
    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, totalItems]);

  // Re-enable transitions
  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

  // Automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const getTransformStyle = () => {
    const offset = (currentIndex * 100) / itemsPerView;
    return {
      transform: `translateX(-${offset}%)`,
      transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
    };
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12 bg-primary">
      <div className="text-center select-none mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mitra text-5xl font-bold text-gray-50"
        >
          گالری
        </motion.h1>
        <p className="text-gray-300 font-mitra mt-4 text-xl">تجربه خاطره انگیزترین لحظات</p>
      </div>

      <div className="relative w-full max-w-[90vw] px-4">
        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-[-4px] w-24 bg-gradient-to-r from-primary to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-[-4px] w-24 bg-gradient-to-l from-primary to-transparent z-10"></div>

        <div className="overflow-hidden">
          <motion.div
            className="flex"
            style={getTransformStyle()}
            ref={sliderRef}
          >
            {extendedImages.map((src, index) => (
              <motion.div
                key={index}
                className="flex-none w-full sm:w-1/3 lg:w-1/5 p-3"
                style={{ width: `${100 / itemsPerView}%` }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg bg-white"
                >
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}