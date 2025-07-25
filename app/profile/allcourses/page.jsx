"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
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
        console.error("Error fetching courses or seasons:", err);
        const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
        toast.error(errorMessage);
        setError(errorMessage);
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
        console.error("Error fetching batches for course", courseId, err);
        const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
        toast.error(errorMessage);
      }
    }
  };

  const toggleSignupCard = async (batchId) => {
    if (openSignupBatchId === batchId) {
      setOpenSignupBatchId(null);
      setSelectedChildId(null);
      setSelectedPaymentMethod(null);
      setSignupSuccess(null);
      return;
    }
    setOpenSignupBatchId(batchId);
    setSelectedChildId(null);
    setSelectedPaymentMethod(null);
    setSignupSuccess(null);
    setLoadingChildren(true);
    try {
      const childrenData = await getChildren();
      setChildren(childrenData);
    } catch (err) {
      console.error("Error fetching children:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setLoadingChildren(false);
    }
  };

  const getSeasonById = (seasonId) => {
    return seasons.find((season) => season.id === seasonId);
  };

  const handleSignup = async (batchId) => {
    if (!selectedChildId || !selectedPaymentMethod) {
      const errorMessage = "لطفا فرزند و روش پرداخت را انتخاب کنید.";
      toast.error(errorMessage);
      return;
    }
    setSignupLoading(true);
    setSignupSuccess(null);
    try {
      const response = await registerChildToBatch(
        batchId,
        selectedChildId,
        selectedPaymentMethod
      );
      const successMessage = response.data?.message || "ثبت نام با موفقیت انجام شد.";
      toast.success(successMessage);
      setSignupSuccess(successMessage);
      setOpenSignupBatchId(null);
      setSelectedChildId(null);
      setSelectedPaymentMethod(null);
    } catch (err) {
      console.error("Error registering child to batch:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
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
    return <LoadingSpinner />;
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
      className="min-h-screen p-6 text-black font-mitra w-5/6 flex flex-col items-center max-md:mx-auto"
    >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        rtl={true}
      />
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
                        <AnimatePresence>
                          {openSignupBatchId === batch.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                            >
                              <motion.div
                                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 relative"
                              >
                                <button
                                  onClick={() => setOpenSignupBatchId(null)}
                                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                  <IoClose className="text-2xl" />
                                </button>
                                {loadingChildren ? (
                                  <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-right">
                                      ثبت نام فرزند
                                    </h3>
                                    <div className="mb-6">
                                      <h4 className="font-semibold text-lg mb-3 text-right">
                                        انتخاب فرزند
                                      </h4>
                                      {children.length === 0 ? (
                                        <p className="text-gray-600 text-right">فرزندی یافت نشد.</p>
                                      ) : (
                                        <motion.ul
                                          className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50"
                                          initial={{ height: 0 }}
                                          animate={{ height: "auto" }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {children.map((child) => (
                                            <motion.li
                                              key={child.id}
                                              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                                selectedChildId === child.id
                                                  ? "bg-green-100 border-green-500"
                                                  : "hover:bg-gray-100"
                                              }`}
                                              onClick={() => setSelectedChildId(child.id)}
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.98 }}
                                            >
                                              {child.full_name}
                                            </motion.li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </div>
                                    <div className="mb-6">
                                      <h4 className="font-semibold text-lg mb-3 text-right">
                                        انتخاب روش پرداخت
                                      </h4>
                                      {paymentMethods.length === 0 ? (
                                        <p className="text-gray-600 text-right">روش پرداختی یافت نشد.</p>
                                      ) : (
                                        <motion.ul
                                          className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50"
                                          initial={{ height: 0 }}
                                          animate={{ height: "auto" }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {paymentMethods.map((method) => (
                                            <motion.li
                                              key={method.key}
                                              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                                selectedPaymentMethod === method.key
                                                  ? "bg-green-100 border-green-500"
                                                  : "hover:bg-gray-100"
                                              }`}
                                              onClick={() => setSelectedPaymentMethod(method.key)}
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.98 }}
                                            >
                                              {method.label} - {method.price} تومان
                                            </motion.li>
                                          ))}
                                        </motion.ul>
                                      )}
                                    </div>
                                    <motion.button
                                      onClick={() => handleSignup(batch.id)}
                                      disabled={signupLoading}
                                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {signupLoading ? "در حال ثبت نام..." : "ثبت نام فرزندم"}
                                    </motion.button>
                                    {signupSuccess && (
                                      <motion.p
                                        className="text-center text-green-600 mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                      >
                                        {signupSuccess}
                                      </motion.p>
                                    )}
                                  </>
                                )}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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