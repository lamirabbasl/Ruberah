"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

import {
  getCourses,
  getCourseBatches,
  getSeasons,
  getChildren,
  registerChildToBatch,
} from "@/lib/api/api";
import { convertToJalali } from "@/lib/utils/convertDate";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [openCourseId, setOpenCourseId] = useState(null);
  const [batchesByCourse, setBatchesByCourse] = useState({});
  const [openSignupBatchId, setOpenSignupBatchId] = useState(null);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(null);

  useEffect(() => {
    const fetchCoursesAndSeasons = async () => {
      setLoadingCourses(true);
      try {
        const [coursesData, seasonsData] = await Promise.all([
          getCourses(),
          getSeasons(),
        ]);
        setCourses(coursesData);
        setSeasons(seasonsData);
      } catch (err) {
        setError(err.message || "خطا در دریافت داده‌ها");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCoursesAndSeasons();
  }, []);

  const toggleCourse = async (courseId) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }
    setOpenCourseId(courseId);
    if (!batchesByCourse[courseId]) {
      try {
        const data = await getCourseBatches(courseId);
        setBatchesByCourse((prev) => ({ ...prev, [courseId]: data }));
      } catch (err) {
        setError(err.message || "خطا در دریافت بچ‌ها");
      }
    }
  };

  const toggleSignupCard = async (batchId) => {
    if (openSignupBatchId === batchId) {
      setOpenSignupBatchId(null);
      setSelectedChildId(null);
      setSelectedPaymentMethod(null);
      setSignupError(null);
      setSignupSuccess(null);
      return;
    }
    setOpenSignupBatchId(batchId);
    setSelectedChildId(null);
    setSelectedPaymentMethod(null);
    setSignupError(null);
    setSignupSuccess(null);
    setLoadingChildren(true);
    try {
      const childrenData = await getChildren();
      setChildren(childrenData);
    } catch (err) {
      setSignupError(err.message || "خطا در دریافت فرزندان");
    } finally {
      setLoadingChildren(false);
    }
  };

  const getSeasonById = (seasonId) => {
    return seasons.find((season) => season.id === seasonId);
  };

  const handleSignup = async (batchId) => {
    if (!selectedChildId || !selectedPaymentMethod) {
      setSignupError("لطفا فرزند و روش پرداخت را انتخاب کنید.");
      return;
    }
    setSignupLoading(true);
    setSignupError(null);
    setSignupSuccess(null);
    try {
      await registerChildToBatch(
        batchId,
        selectedChildId,
        selectedPaymentMethod
      );
      setSignupSuccess("ثبت نام با موفقیت انجام شد.");
      // Optionally close the signup card or reset selections
      setOpenSignupBatchId(null);
      setSelectedChildId(null);
      setSelectedPaymentMethod(null);
    } catch (err) {
      setSignupError(err.message || "خطا در ثبت نام");
    } finally {
      setSignupLoading(false);
    }
  };

  const getPaymentMethods = (batch) => {
    const methods = [];
    if (batch.allow_gateway) {
      methods.push({
        key: "gateway",
        label: "درگاه",
        price: batch.price_gateway,
      });
    }
    if (batch.allow_receipt) {
      methods.push({
        key: "receipt",
        label: "رسید",
        price: batch.price_receipt,
      });
    }
    if (batch.allow_installment) {
      const installmentCount = Array.isArray(batch.installment_templates)
        ? batch.installment_templates.length
        : 0;
      methods.push({
        key: "installment",
        label: `اقساط (${installmentCount} قسط)`,
        price: batch.price_installment,
      });
    }
    return methods.filter((m) => m.price !== null && m.price !== undefined);
  };

  if (loadingCourses) {
    return (
      <LoadingSpinner />
    );
  }

  if (error) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center font-mitra text-red-600 text-lg"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 font-mitra w-5/6 flex flex-col items-center max-md:mx-auto"
    >
      <h1 className="text-4xl font-bold text-gray-700 md:mt-14 mb-8">
        دوره‌ها
      </h1>
      {courses.map((course) => (
        <div
          key={course.id}
          className="w-full max-w-[820px] bg-gray-100 rounded-xl shadow-lg mb-8 p-5"
        >
          <button
            onClick={() => toggleCourse(course.id)}
            className="w-full relative text-right text-2xl font-bold text-gray-800 hover:text-gray-900 focus:outline-none"
          >
            {course.name}
            <p className=" text-lg bg-secondery text-white px-4 py-1 rounded-2xl absolute left-0 top-0">
              نمایش
            </p>
          </button>
          {course.description && (
            <p className="text-gray-600 mt-1 text-right">
              {course.description}
            </p>
          )}
          {openCourseId === course.id && (
            <>
              <div className="mt-4 max-md:hidden grid grid-cols-7 gap-x-2 pr-6 text-sm sm:text-lg text-gray-800 text-right w-full max-w-3xl mx-auto font-semibold  pb-2">
                <div className="pr-5">دوره</div>
                <div>محدوده سنی</div>
                <div>ظرفیت</div>
                <div>مکان</div>
                <div className="pr-6">شروع</div>
                <div className="pr-6">پایان</div>
                <div></div>
              </div>
              <div className="mt-2 space-y-3 max-w-3xl mx-auto">
                {batchesByCourse[course.id] &&
                batchesByCourse[course.id].length > 0 ? (
                  batchesByCourse[course.id].map((batch) => {
                    const season = getSeasonById(batch.season);
                    const paymentMethods = getPaymentMethods(batch);
                    return (
                      <div
                        key={batch.id}
                        className="bg-white rounded-lg shadow p-4 border border-gray-300"
                      >
                        <div className="flex flex-col sm:grid sm:grid-cols-7 gap-y-2 gap-x-8 text-sm sm:text-lg text-gray-800 text-right w-full">
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              دوره:{" "}
                            </span>
                            <span className="font-bold">{batch.title}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              محدوده سنی:{" "}
                            </span>
                            <span>
                              {batch.min_age} تا {batch.max_age} سال
                            </span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              ظرفیت:{" "}
                            </span>
                            <span>{batch.capacity} نفر</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              مکان:{" "}
                            </span>
                            <span>{batch.location}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              شروع:{" "}
                            </span>
                            <span>{season ? convertToJalali(season.start_date) : ""}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-20">
                              پایان:{" "}
                            </span>
                            <span>{season ? convertToJalali(season.end_date) : ""}</span>
                          </div>
                          <div className="flex sm:block">
                            <button
                              onClick={() => toggleSignupCard(batch.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none"
                            >
                              ثبت نام
                            </button>
                          </div>
                        </div>
                        {openSignupBatchId === batch.id && (
                          <div className="fixed inset-0 flex items-center text-black justify-center backdrop-blur-3xl z-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
                              <button
                                onClick={() => setOpenSignupBatchId(null)}
                                className="mb-4 flex mr-auto text-right text-red-600 hover:text-red-800 font-bold"
                              >
                                <IoClose className="text-2xl" />
                              </button>
                              {loadingChildren ? (
                                <p className="text-center text-gray-600">
                                  در حال بارگذاری فرزندان...
                                </p>
                              ) : signupError ? (
                                <p className="text-center text-red-600">
                                  {signupError}
                                </p>
                              ) : (
                                <>
                                  <div className="mb-6">
                                    <h3 className="font-semibold text-xl mb-4">
                                      انتخاب فرزند
                                    </h3>
                                    {children.length === 0 ? (
                                      <p>فرزندی یافت نشد.</p>
                                    ) : (
                                      <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                                        {children.map((child) => (
                                          <li
                                            key={child.id}
                                            className={`cursor-pointer relative p-2 rounded ${
                                              selectedChildId === child.id
                                                ? "bg-green-300"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              setSelectedChildId(child.id)
                                            }
                                          >
                                            {child.full_name}{" "}
                                            <p className=" absolute top-2 left-1 bg-blue-500 px-2  rounded-2xl text-white">
                                              انتخاب
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <div className="mb-4">
                                    <h3 className="font-semibold text-xl mb-4">
                                      انتخاب روش پرداخت
                                    </h3>
                                    {paymentMethods.length === 0 ? (
                                      <p>روش پرداختی یافت نشد.</p>
                                    ) : (
                                      <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded p-2">
                                        {paymentMethods.map((method) => (
                                          <li
                                            key={method.key}
                                            className={`cursor-pointer relative p-2 rounded ${
                                              selectedPaymentMethod ===
                                              method.key
                                                ? "bg-green-300"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              setSelectedPaymentMethod(
                                                method.key
                                              )
                                            }
                                          >
                                            {method.label} - {method.price}{" "}
                                            تومان
                                            <p className=" absolute top-2 left-1 bg-blue-500 px-2  rounded-2xl text-white">
                                              انتخاب
                                            </p>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleSignup(batch.id)}
                                    disabled={signupLoading}
                                    className="bg-blue-600 flex mt-10 mx-auto text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    {signupLoading
                                      ? "در حال ثبت نام..."
                                      : "ثبت نام فرزندم"}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-600 text-center">
                    بچ برای این دوره موجود نیست.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AllCourses;
