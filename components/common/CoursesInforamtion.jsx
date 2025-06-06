"use client";

import React, { useState, useEffect } from "react";
import { getCourses, getCourseBatches, getSeasons } from "../../lib/api/api";

export default function CoursesInforamtion() {
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
      // Collapse if already expanded
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
    return <div className="p-4 text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl font-mitra mx-auto p-4 pt-30 ">
      <h1 className="text-3xl font-bold mb-6 text-center">اطلاعات دوره‌ها</h1>
      <div className="space-y-4 text-black">
        {courses.map((course) => (
          <div
            key={course.id}
            className="border rounded-md p-4 cursor-pointer bg-white shadow hover:shadow-md transition"
          >
            <div
              className="flex justify-between items-center"
              onClick={() => handleCourseClick(course.id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{course.name}</h2>
                {course.description && (
                  <p className="text-gray-600 mt-1">{course.description}</p>
                )}
              </div>
              <div className="text-2xl select-none">
                {expandedCourseId === course.id ? "▲" : "▼"}
              </div>
            </div>
            {expandedCourseId === course.id && (
              <div className="mt-4 border-t pt-4">
                {loadingBatches[course.id] ? (
                  <p>Loading batches...</p>
                ) : batchesByCourse[course.id] && batchesByCourse[course.id].length > 0 ? (
                  <ul className="space-y-3">
                    {batchesByCourse[course.id].map((batch) => {
                      const season = getSeasonById(batch.season);
                      return (
                        <li
                          key={batch.id}
                          className="border rounded p-3 bg-gray-50"
                        >
                          <h3 className="font-semibold text-lg">{batch.title}</h3>
                          {season && (
                            <p className="text-sm text-gray-700">
                              فصل: {season.name} ({season.start_date} - {season.end_date})
                            </p>
                          )}
                          <p className="text-sm text-gray-700">
                            محدوده سنی: {batch.min_age} تا {batch.max_age} سال
                          </p>
                          <p className="text-sm text-gray-700">
                            برنامه: {batch.schedule}
                          </p>
                          <p className="text-sm text-gray-700">
                            ظرفیت: {batch.capacity}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>هیچ دوره‌ای یافت نشد.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
