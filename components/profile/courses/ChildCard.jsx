import React from "react";
import CourseRow from "./CourseRow";

function ChildCard({ child, childIndex, openCourseIdx, toggleCourse, handleImageUpload }) {
  return (
    <div
      className="w-screen max-w-3xl bg-gray-100 rounded-xl shadow-lg mb-8 p-5"
    >
      <div className="flex items-center mb-4 gap-4">
        <img
          src={child.image || "/path/to/fallback-image.jpg"}
          alt={child.name}
          width={70}
          height={70}
          className="w-22 h-22 rounded-full object-cover border-2 border-blue-500 shadow"
        />
        <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
      </div>

      <div className="hidden sm:flex justify-between items-center pr-6 bg-gray-100 border-b-2 border-gray-200 p-3 rounded-t-lg text-lg text-gray-600 text-right">
        <div className="flex flex-wrap gap-x-6 mr-8 gap-y-1">
          <span className="w-20">دوره</span>
          <span className="w-24">شروع</span>
          <span className="w-20">پایان</span>
          <span className="w-20">مکان</span>
          <span className="w-24">وضعیت پرداخت</span>
        </div>
      </div>

      <div className="space-y-3 mt-2">
        {child.courses.map((course, courseIndex) => (
          <CourseRow
            key={courseIndex}
            course={course}
            childIndex={childIndex}
            courseIndex={courseIndex}
            isOpen={openCourseIdx[`${childIndex}-${courseIndex}`]}
            toggleCourse={toggleCourse}
            handleImageUpload={handleImageUpload}
          />
        ))}
      </div>
    </div>
  );
}

export default ChildCard;