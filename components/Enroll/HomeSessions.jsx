"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeSessions() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      title: "مقدماتی ری‌اکت",
      teacher: "محمد رضایی",
      price: "۴۹٬۰۰۰ تومان",
      startTime: "۱۴۰۴/۰۲/۱۱ - ساعت ۱۰ صبح",
      opacity: 70,
      image: "/testimages/c1.jpg",
    },
    {
      title: "پیشرفته نکست‌جی‌اس",
      teacher: "سارا احمدی",
      price: "۷۹٬۰۰۰ تومان",
      startTime: "۱۴۰۴/۰۲/۱۳ - ساعت ۱۴",
      opacity: 90,
      image: "/testimages/c2.jpg",
    },
    {
      title: "آموزش کامل تیلویند CSS",
      teacher: "علیرضا قنبری",
      price: "۳۹٬۰۰۰ تومان",
      startTime: "۱۴۰۴/۰۲/۱۵ - ساعت ۱۸",
      opacity: 50,
      image: "/testimages/c3.jpg",
    },
    {
      title: "جاوااسکریپت برای مبتدی‌ها",
      teacher: "لیلا صادقی",
      price: "۲۹٬۰۰۰ تومان",
      startTime: "۱۴۰۴/۰۲/۱۰ - ساعت ۹ صبح",
      opacity: 60,
      image: "/testimages/c4.jpg",
    },
    {
      title: "بوت‌استرپ در عمل",
      teacher: "حسین حسینی",
      price: "۲۵٬۰۰۰ تومان",
      startTime: "۱۴۰۴/۰۲/۲۰ - ساعت ۱۶",
      opacity: 80,
      image: "/testimages/c5.jpg",
    },
  ];

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleSignUp = () => {
    router.push("/"); // Redirect to home page
  };

  return (
    <div dir="rtl" className="min-h-screen w-screen p-8 pt-[140px] ">
      <h1 className="text-3xl font-bold mb-8 text-center">دوره‌های آموزشی</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            onClick={() => handleCourseSelect(course)}
            className={`bg-white h-[160px]  rounded-xl flex flex-row-reverse items-center overflow-hidden cursor-pointer ${
              selectedCourse === course ? " outline-4 outline-blue-500" : ""
            }`}
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-32 h-[160px] object-cover"
            />
            <div className="flex-1 p-4 text-gray-800">
              <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
              <p className="text-sm">مدرس: {course.teacher}</p>
              <p className="text-xs text-gray-500">شروع: {course.startTime}</p>
              <p className="text-green-600 font-bold mt-2">{course.price}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            ثبت‌ نام در دوره
          </button>
        </div>
      )}
    </div>
  );
}
