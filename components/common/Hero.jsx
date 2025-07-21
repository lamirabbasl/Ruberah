import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineImport } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { getFirstPage } from "@/lib/api/api";

// Array of image URLs (replace with your actual image URLs)
const images = [
  "/hero/n7.jpg",
  "/hero/n8.jpg",
  "/hero/n6.jpg",
  "/hero/n5.jpg",
  "/hero/n4.jpg",
  "/hero/n3.jpg",
  "/hero/n2.jpg",
  "/hero/n1.jpg",
];

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [presentationText, setPresentationText] = useState("");

  // Effect to cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Effect to fetch presentation text from the API
  useEffect(() => {
    const fetchPresentationText = async () => {
      try {
        const data = await getFirstPage();
        setPresentationText(data.presentation_text || "");
      } catch (error) {
        console.error("Error fetching presentation text:", error);
        setPresentationText("");
      }
    };
    fetchPresentationText();
  }, []);

  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  // Animation variants for the button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-b from-amber-100 to-amber-200 overflow-hidden">
      {/* Background Image Slider */}
      <AnimatePresence>
        {images.map((image, index) => (
          index === currentImage && (
            <motion.img
              key={index}
              src={image}
              alt={`Background ${index + 1}`}
              className="absolute top-0 left-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )
        ))}
      </AnimatePresence>

      {/* Overlay for better contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-black/40 z-0"></div>

      {/* Text Div */}
      <motion.div
        className="relative z-10 max-w-2xl mx-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl text-center shadow-lg"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="font-mitra text-3xl md:text-4xl cursor-default text-white font-bold leading-relaxed">
          {presentationText }
        </h1>
      </motion.div>

      {/* Button */}
      <motion.div
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="relative z-10 mt-40"
      >
        <Link href="/enroll">
          <button className="flex items-center cursor-pointer gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-mitra text-xl md:text-2xl py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <span>فرآیند ثبت نام</span>
            <AiOutlineImport className="text-xl" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

export default Hero;