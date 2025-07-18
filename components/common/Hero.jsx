import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineImport } from "react-icons/ai";
import { getFirstPage } from "@/lib/api/api"; // Import the API function

function Hero() {
  // State to track the current image index
  const [currentImage, setCurrentImage] = useState(0);
  // State to store the presentation text from the API
  const [presentationText, setPresentationText] = useState("");

  // Array of image URLs (replace with your actual image URLs)
  const images = [
    "hero/n7.jpg",
    "hero/n8.jpg",
    "hero/n6.jpg",
    "hero/n5.jpg",
    "hero/n4.jpg",
    "hero/n3.jpg",
    "hero/n2.jpg",
    "hero/n1.jpg",
  ];

  // Effect to cycle through images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

  // Effect to fetch presentation text from the API
  useEffect(() => {
    const fetchPresentationText = async () => {
      try {
        const data = await getFirstPage(); // Fetch data from the API
        setPresentationText(data.presentation_text || ""); // Set the presentation text or fallback to empty string
      } catch (error) {
        console.error("Error fetching presentation text:", error);
        setPresentationText(""); // Fallback in case of error
      }
    };

    fetchPresentationText();
  }, []);

  return (
    <div className="relative flex flex-col w-screen h-screen justify-between font-iransas items-center bg-amber-50 p-4 overflow-hidden">
      {/* Background Image Slider */}
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Background ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImage ? "opacity-50" : "opacity-0"
          }`}
        />
      ))}
      {/* Overlay for better contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-2"></div>

      {/* Text Div */}
      <div className="relative font-mitra text-2xl rounded-full cursor-default p-2 bg-black max-md:rounded-[10px] bg-opacity-80 max-md:w-9/10 mt-[180px] w-1/3 text-white text-center max-md:text-md z-10">
        <span>{presentationText}</span> {/* Use the fetched presentation text */}
      </div>

      {/* Button */}
      <Link href={"/enroll"}>
        <button className="relative font-mitra flex items-center text-xl cursor-pointer mb-10 gap-1 bg-[#37B360] py-1 px-4 rounded-full z-10">
          <span className="text-3xl">فرآیند ثبت نام</span>
          <AiOutlineImport className="text-xl" />
        </button>
      </Link>
    </div>
  );
}

export default Hero;