"use client";

import React, { useState, useEffect } from "react";
import { getCourses, getCourseBatches, getSeasons } from "../../lib/api/api";
import { motion, AnimatePresence } from "framer-motion";

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
        setError("Failed to load courses or seasons.");
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
        setError("Failed to load batches for the course.");
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded-lg m-4 text-base">
        {error}
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-5xl mx-auto font-mitra p-6 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-10 text-center text-gray-800"
      >
        اطلاعات دوره‌ها
      </motion.h1>
      <div className="space-y-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div
              className="cursor-pointer p-4 relative"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-row-reverse justify-between">
                    <motion.div
                      animate={{ rotate: expandedCourseId === course.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500 text-2xl"
                    >
                
                    </motion.div>
                    <h2 className="text-3xl font-semibold mt-4 text-gray-800">
                      {course.name}
                    </h2>
                  </div>
                  {course.description && (
                    <p className="text-gray-600 mt-2 text-right text-base">{course.description}</p>
                  )}
                </div>
                {course.image && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={`http://188.121.100.138${course.image}`}
                    alt={course.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
            <AnimatePresence>
              {expandedCourseId === course.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-gray-50 border-t"
                >
                  {loadingBatches[course.id] ? (
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-8 h-8 border-2 border-t-blue-500 border-gray-200 rounded-full"
                      />
                    </div>
                  ) : batchesByCourse[course.id]?.length > 0 ? (
                    <div>
                      <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-1 border-b p-3 bg-gray-100 text-base font-semibold text-gray-800">
                        <span className="min-w-[100px]">عنوان</span>
                        <span className="min-w-[200px]">فصل</span>
                        <span className="min-w-[120px]">محدوده سنی</span>
                        <span className="min-w-[150px]">برنامه</span>
                        <span className="min-w-[80px]">ظرفیت</span>
                      </div>
                      <ul className="space-y-2 mt-2">
                        {batchesByCourse[course.id].map((batch) => {
                          const season = getSeasonById(batch.season);
                          return (
                            <motion.li
                              key={batch.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex flex-wrap items-center gap-x-4 gap-y-1 border rounded-lg p-3 bg-white shadow-sm text-base text-gray-600"
                            >
                              <span className="min-w-[100px] md:min-w-[100px]">
                                <span className="md:hidden font-semibold">عنوان: </span>
                                {batch.title}
                              </span>
                              <span className="min-w-[200px] md:min-w-[200px]">
                                <span className="md:hidden font-semibold">فصل: </span>
                                {season ? (
                                  `${season.name} (${season.start_date} - ${season.end_date})`
                                ) : (
                                  "-"
                                )}
                              </span>
                              <span className="min-w-[120px] md:min-w-[120px]">
                                <span className="md:hidden font-semibold">محدوده سنی: </span>
                                {batch.min_age} تا {batch.max_age} سال
                              </span>
                              <span className="min-w-[150px] md:min-w-[150px]">
                                <span className="md:hidden font-semibold">برنامه: </span>
                                {batch.schedule}
                              </span>
                              <span className="min-w-[80px] md:min-w-[80px]">
                                <span className="md-hidden font-semibold">ظرفیت: </span>
                                {batch.capacity}
                              </span>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center text-base">هیچ دوره‌ای یافت نشد.</p>
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