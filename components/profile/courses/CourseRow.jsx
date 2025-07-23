import React from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import CourseDetails from "./CourseDetails";

function CourseRow({ course, childIndex, courseIndex, isOpen, toggleCourse, handleImageUpload }) {
  return (
    <div>
      <div
        className="flex relative flex-col sm:flex-row sm:justify-between sm:items-center pr-4 sm:pr-6 bg-white rounded-lg shadow p-3 border hover:shadow-md transition cursor-pointer"
        onClick={() => toggleCourse(childIndex, courseIndex)}
      >
        <div className="flex flex-col sm:grid sm:grid-cols-5 gap-y-2 gap-x-4 text-sm sm:text-lg text-gray-800 text-right w-full">
          <div className="flex sm:block">
            <span className="block sm:hidden w-20">دوره: </span>
            <span className="font-bold">{course.name}</span>
          </div>
          <div className="flex sm:block">
            <span className="block sm:hidden w-20">شروع: </span>
            <span>{convertToJalali(course.start)}</span>
          </div>
          <div className="flex sm:block">
            <span className="block sm:hidden w-20">پایان: </span>
            <span>{convertToJalali(course.end)}</span>
          </div>
          <div className="flex sm:block">
            <span className="block sm:hidden w-24">مکان: </span>
            <span>{course.paymentInfo?.location}</span>
          </div>
          <div className="flex sm:block">
            <span className="block sm:hidden w-24">وضعیت پرداخت: </span>
            <span className="font-semibold">
              {course.paid ? (
                <span className="text-green-600">پرداخت کامل</span>
              ) : (
                <span className="text-red-500">اقساط</span>
              )}
            </span>
          </div>
        </div>
        <div className="max-md:absolute left-4 top-6 flex justify-center">
          <span className="font-semibold block sm:hidden w-20">روش پرداخت: </span>
          <span className="font-semibold">{course.paymentInfo?.paymentMethod}</span>
        </div>
        <div className="max-md:absolute left-4 top-6 flex justify-center">
          <img
            src={course.image || "/path/to/fallback-image.jpg"}
            alt={course.name}
            width={60}
            height={60}
            className="rounded-md max-md:w-[100px] max-md:h-[100px] object-cover border border-gray-300"
          />
        </div>
      </div>

      {isOpen && (
        <CourseDetails
          course={course}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}

export default CourseRow;