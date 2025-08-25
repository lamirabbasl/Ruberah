"use client";

import React, { useState, useEffect } from "react";
import { getCourses, getCourseBatches, getSeasons } from "../../lib/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { convertToJalali } from "@/lib/utils/convertDate";

export default function CoursesInformation() {
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [batchesByCourse, setBatchesByCourse] = useState({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCoursesAndSeasons() {
      try {
        setLoadingCourses(true);
        const [coursesData, seasonsData] = await Promise.all([
          getCourses(),
          getSeasons(),
        ]);
        setCourses(coursesData);
        setSeasons(seasonsData);
      } catch (err) {
        setError("خطا در بارگذاری دوره‌ها یا فصل‌ها.");
        console.error(err);
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCoursesAndSeasons();
  }, []);

  const handleCourseClick = async (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
      return;
    }
    setExpandedCourseId(courseId);

    if (!batchesByCourse[courseId]) {
      try {
        setLoadingBatches((prev) => ({ ...prev, [courseId]: true }));
        const batches = await getCourseBatches(courseId);
        setBatchesByCourse((prev) => ({ ...prev, [courseId]: batches }));
      } catch (err) {
        setError("خطا در بارگذاری دسته‌های دوره.");
        console.error(err);
      } finally {
        setLoadingBatches((prev) => ({ ...prev, [courseId]: false }));
      }
    }
  };

  const getSeasonById = (id) => {
    return seasons.find((season) => season.id === id);
  };

  if (loadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-t-blue-600 border-gray-300 rounded-full"
        />
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-6xl mx-auto p-8 min-h-screen font-mitra">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-5xl md:text-6xl font-extrabold mb-12 text-center text-gray-900 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent"
      >
        اطلاعات دوره‌ها
      </motion.h1>
      <div className="space-y-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div
              className="cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="flex items-center gap-6">
                {course.image && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${course.image}`}
                    alt={course.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-sm"
                  />
                )}
                <div className="flex-1">
                  <div className="flex flex-row-reverse justify-between items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {course.name}
                    </h2>
                    <motion.div
                      animate={{ rotate: expandedCourseId === course.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500 text-2xl"
                    >
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </div>
                  {course.description && (
                    <p className="text-gray-600 mt-3 text-right text-base md:text-lg leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <AnimatePresence>
              {expandedCourseId === course.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="p-6 bg-gray-50 border-t border-gray-100"
                >
                  {loadingBatches[course.id] ? (
                    <div className="flex justify-center py-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-10 h-10 border-3 border-t-blue-600 border-gray-300 rounded-full"
                      />
                    </div>
                  ) : batchesByCourse[course.id]?.filter((batch) => batch.booking_open === true).length > 0 ? (
                    <div>
                      <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-gray-100 rounded-lg text-base font-semibold text-gray-800 text-center">
                        <span>عنوان</span>
                        <span>فصل</span>
                        <span>محدوده سنی</span>
                        <span>برنامه</span>
                        <span>ظرفیت</span>
                      </div>
                      <ul className="space-y-3 mt-3">
                        {batchesByCourse[course.id]
                          .filter((batch) => batch.booking_open === true)
                          .map((batch) => {
                            const season = getSeasonById(batch.season);
                            return (
                              <motion.li
                                key={batch.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-5  gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-base text-gray-700"
                              >
                                <span className="md:text-center">
                                  <span className="md:hidden font-semibold">عنوان: </span>
                                  {batch.title}
                                </span>
                                <span className="md:text-center">
                                  <span className="md:hidden font-semibold ">فصل: </span>
                                  {season ? (
                                    <div>
                                        <p>{season.name} </p>
                                        <p>({convertToJalali(season.start_date)} - {convertToJalali(season.end_date)})</p>

                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </span>
                                <span className="md:text-center">
                                  <span className="md:hidden font-semibold">محدوده سنی: </span>
                                  {batch.min_age} تا {batch.max_age} سال
                                </span>
                                <span className="md:text-center">
                                  <span className="md:hidden font-semibold">برنامه: </span>
                                  {batch.schedule}
                                </span>
                                <span className="md:text-center">
                                  <span className="md:hidden font-semibold">ظرفیت: </span>
                                  {batch.capacity}
                                </span>
                              </motion.li>
                            );
                          })}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center text-base py-4">
                      هیچ دوره‌ای یافت نشد
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}