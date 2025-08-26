import React, { useState } from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import CourseDetails from "./CourseDetails";

function CourseRow({ course, childIndex, courseIndex, handleImageUpload }) {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 bg-neutral-200 rounded-xl shadow-md p-4 border border-gray-300 hover:shadow-lg transition-shadow duration-300 text-right text-gray-800">
        <div className="flex items-center sm:block">
          <span className="block sm:hidden font-semibold w-20">دوره: </span>
          <span className="font-bold text-gray-900">{course.name}</span>
        </div>
        <div className="flex items-center sm:block">
          <span className="block sm:hidden font-semibold w-20">شروع: </span>
          <span>{convertToJalali(course.start)}</span>
        </div>
        <div className="flex items-center sm:block">
          <span className="block sm:hidden font-semibold w-20">پایان: </span>
          <span>{convertToJalali(course.end)}</span>
        </div>
        <div className="flex items-center sm:block">
          <span className="block sm:hidden font-semibold w-24">مکان: </span>
          <span>{course.paymentInfo?.location}</span>
        </div>
        <div className="flex items-center sm:block">
          <span className="block sm:hidden font-semibold w-24">وضعیت پرداخت: </span>
          <span className={`font-semibold ${course.paid ? "text-green-600" : "text-red-500"}`}>
            {course.paid ? "پرداخت کامل" : course.paymentInfo?.paymentMethod}
          </span>
        </div>
        <div className="flex items-center sm:block">
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition duration-200 text-sm font-medium w-full sm:w-auto"
          >
            حساب‌های بانکی
          </button>
        </div>
      </div>

      <CourseDetails
        course={course}
        handleImageUpload={handleImageUpload}
        isBankModalOpen={isBankModalOpen}
        setIsBankModalOpen={setIsBankModalOpen}
      />
    </div>
  );
}

export default CourseRow;