"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  getRegistrations,
  getChildById,
  getBatchById,
  getSeasons,
  uploadInstallmentPayment,
} from "@/lib/api/api";

const mockChildren = [
  {
    name: "آتوسا آریایی",
    image: "/profile/child1.jpg",
    courses: [
      {
        name: "جیرجیرک",
        teacher: "خانم احمدی",
        start: "1403/01/10",
        end: "1403/03/20",
        paid: true,
        image: "/testimages/n1.jpg",
        paymentInfo: {
          time: "1403/01/08 14:30",
          amount: "2,500,000 تومان",
          code: "PMT12345678",
        },
      },
      {
        name: "رشد افرا",
        teacher: "آقای موسوی",
        start: "1403/02/01",
        end: "1403/04/10",
        paid: false,
        image: "/testimages/n2.jpg",
        installments: [
          { paid: true, due: "1403/02/15", amount: "900,000 تومان" },
          { paid: false, due: "1403/03/15", amount: "900,000 تومان" },
          { paid: false, due: "1403/04/10", amount: "900,000 تومان" },
        ],
      },
    ],
  },
  {
    name: "کاوه آریایی",
    image: "/profile/child2.jpg",
    courses: [
      {
        name: "جیرجیرک",
        teacher: "خانم رضایی",
        start: "1403/01/15",
        end: "1403/03/30",
        paid: true,
        image: "/testimages/n1.jpg",
        paymentInfo: {
          time: "1403/01/12 11:45",
          amount: "2,800,000 تومان",
          code: "PMT65432100",
        },
      },
    ],
  },
];

function CoursesPage() {
  const [openCourseIdx, setOpenCourseIdx] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [batchesMap, setBatchesMap] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);

  const toggleCourse = (childIndex, courseIndex) => {
    const key = `${childIndex}-${courseIndex}`;
    setOpenCourseIdx((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen font-mitra p-6 flex flex-col items-center"
    >
      <h1 className="text-4xl font-bold text-gray-700 mb-6">
        دوره‌های فرزندان
      </h1>

      {mockChildren.map((child, childIndex) => (
        <div
          key={childIndex}
          className="w-screen max-w-3xl bg-gray-100 rounded-xl shadow-lg mb-8 p-5"
        >
          {/* فرزند */}
          <div className="flex items-center mb-4 gap-4">
            <Image
              src={child.image}
              alt={child.name}
              width={70}
              height={70}
              className="w-22 h-22 rounded-full object-cover border-2 border-blue-500 shadow"
            />
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
          </div>

          {/* عنوان جدول */}
          <div className="hidden sm:flex justify-between items-center pr-6 bg-gray-100 border-b-2 border-gray-200 p-3 rounded-t-lg text-lg text-gray-600 font-semibold text-right">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span className="w-20">دوره</span>
              <span className="w-24">مدرس</span>
              <span className="w-24">شروع</span>
              <span className="w-20">پایان</span>
              <span className="w-24">وضعیت پرداخت</span>
            </div>
          </div>

          {/* دوره‌ها */}
          <div className="space-y-3 mt-2">
            {child.courses.map((course, courseIndex) => {
              const key = `${childIndex}-${courseIndex}`;
              const isOpen = openCourseIdx[key];
              const isInstallment = !course.paid && course.installments;

              return (
                <div key={courseIndex}>
                  {/* Course Row - responsive */}
                  <div
                    className="flex relative flex-col sm:flex-row sm:justify-between sm:items-center pr-4 sm:pr-6 bg-white rounded-lg shadow p-3 border hover:shadow-md transition cursor-pointer"
                    onClick={() => toggleCourse(childIndex, courseIndex)}
                  >
                    {/* Info block */}
                    <div className="flex flex-col sm:grid sm:grid-cols-5 gap-y-2 gap-x-4 text-sm sm:text-base text-gray-800 text-right w-full">
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">
                          دوره:{" "}
                        </span>
                        <span className="font-bold">{course.name}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">
                          مدرس:{" "}
                        </span>
                        <span>{course.teacher}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">
                          شروع:{" "}
                        </span>
                        <span>{course.start}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">
                          پایان:{" "}
                        </span>
                        <span>{course.end}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-24">
                          وضعیت پرداخت:{" "}
                        </span>
                        <span className="font-semibold">
                          {course.paid ? (
                            <span className="text-green-600">پرداخت کامل</span>
                          ) : (
                            <span className="text-red-500">اقساط</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Image */}
                    <div className=" max-md:absolute  left-4 top-6   flex justify-center">
                      <Image
                        src={course.image}
                        alt={course.name}
                        width={60}
                        height={60}
                        className="rounded-md max-md:w-[100px] max-md:h-[100px] object-cover border border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Dropdown Info */}
                  {isOpen && (
                    <div className="bg-gray-50 mt-2 rounded-lg border border-blue-100 p-4 text-right space-y-3 animate-fade-in">
                      {isInstallment ? (
                        <>
                          <h3 className="text-lg font-bold text-blue-700 mb-2">
                            اطلاعات اقساط
                          </h3>
                          {course.installments.map((inst, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-md p-3 shadow text-sm gap-2 sm:gap-0"
                            >
                              <span className="text-gray-700 font-semibold">
                                قسط {idx + 1}
                              </span>
                              <span className="text-gray-700">
                                {inst.amount}
                              </span>
                              <span
                                className={`${
                                  inst.paid ? "text-green-600" : "text-red-500"
                                } font-bold`}
                              >
                                {inst.paid ? "پرداخت شده" : "در انتظار پرداخت"}
                              </span>
                              <span className="text-gray-600">
                                مهلت: {inst.due}
                              </span>
                              <button
                                disabled={inst.paid}
                                className={`px-4 py-1 rounded text-sm ${
                                  inst.paid
                                    ? "bg-gray-300 text-white cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                پرداخت
                              </button>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="bg-white p-3 rounded-md shadow text-md flex flex-col sm:flex-row flex-wrap gap-4 text-black font-medium">
                          <div className="flex gap-4">
                            <span className="font-semibold">زمان پرداخت:</span>{" "}
                            {course.paymentInfo?.time}
                          </div>
                          <div className="flex gap-4">
                            <span className="font-semibold">مبلغ کل:</span>{" "}
                            {course.paymentInfo?.amount}
                          </div>
                          <div className="flex gap-4">
                            <span className="font-semibold">کد پرداخت:</span>{" "}
                            {course.paymentInfo?.code}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CoursesPage;
