import React, { useState, useEffect } from "react";
import CourseRow from "./CourseRow";
import { getChildPhotoUrl } from "@/lib/api/api";
import { toast } from "react-toastify";

function ChildCard({ child, childIndex, handleImageUpload }) {
  const [childImage, setChildImage] = useState(null);

  useEffect(() => {
    async function fetchChildImage() {
      try {
        const photoUrl = await getChildPhotoUrl(child.id);
        setChildImage(photoUrl);
      } catch (err) {
        console.error("Error fetching child photo:", err);    
      }
    }

    if (child.id) {
      fetchChildImage();
    }
  }, [child.id]);

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl mb-10 p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center mb-6 gap-4">
        <img
          src={childImage}
          alt={child.name}
          width={80}
          height={80}
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-gray-200 shadow-md"
        />
        <h2 className="text-3xl font-bold text-gray-900">{child.name}</h2>
      </div>

      <div className="hidden sm:grid grid-cols-6 gap-4 bg-white border-b border-gray-200 p-4 rounded-t-xl text-lg font-semibold text-gray-900 text-right">
        <span>دوره</span>
        <span>شروع</span>
        <span>پایان</span>
        <span>مکان</span>
        <span>وضعیت پرداخت</span>
        <span>حساب‌های بانکی</span>
      </div>

      <div className="space-y-4 mt-4">
        {child.courses.map((course, courseIndex) => (
          <CourseRow
            key={courseIndex}
            course={course}
            childIndex={childIndex}
            courseIndex={courseIndex}
            handleImageUpload={handleImageUpload}
          />
        ))}
      </div>
    </div>
  );
}

export default ChildCard;