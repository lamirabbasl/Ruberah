"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getCourses } from "@/lib/api/api"; // make sure this path is correct

export default function HomePageCourses() {
  const [courses, setCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const sliderRef = useRef(null);
  const router = useRouter();

  const totalItems = courses.length;
  const extendedCourses = [...courses, ...courses, ...courses];

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data || []);
        setCurrentIndex((data?.length || 0)); // Start at middle set
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    slider?.addEventListener("transitionend", handleTransitionEnd);
    return () => slider?.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, totalItems]);

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
        <h1 className="font-mitra text-4xl mt-4">دوره‌ها</h1>
      </div>
      <div className="flex items-center h-auto w-full p-8">
        <FaChevronLeft
          className="text-secondery text-4xl cursor-pointer hover:scale-110 transition"
          onClick={slideLeft}
        />
        <div className="w-full overflow-hidden select-none">
          <div className="flex" style={getTransformStyle()} ref={sliderRef}>
            {extendedCourses.map((course, index) => (
              <div
              key={index}
              className="flex-none w-full sm:w-1/2 lg:w-1/4 p-2 cursor-pointer"
              style={{ width: `${100 / itemsPerView}%` }}
              onClick={() => router.push("/courses")}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                {/* Image section */}
                <div className="w-full h-60 bg-gray-100">
                  {course.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${course.image}`}
                      alt={course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      course.image ? "hidden" : ""
                    }`}
                    style={{ display: course.image ? "none" : "flex" }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-sm">بدون تصویر</span>
                    </div>
                  </div>
                </div>
            
                {/* Text section */}
                <div className="p-4 flex flex-col items-end text-right rtl">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{course.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                </div>
              </div>
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
