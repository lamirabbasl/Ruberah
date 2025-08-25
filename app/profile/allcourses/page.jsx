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
  getBatchTermById,
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
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openTermsBatchId, setOpenTermsBatchId] = useState(null);
  const [terms, setTerms] = useState([]);
  const [loadingTerms, setLoadingTerms] = useState(false);
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
        const errorMessage = err.response?.data?.message  || "خطا در ثبت نام";
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
        const errorMessage = err.response?.data?.message || "خطا در ثبت نام";
        toast.error(errorMessage);
      }
    }
  };

  const toggleTermsModal = async (batchId) => {
    if (openTermsBatchId === batchId) {
      setOpenTermsBatchId(null);
      setTerms([]);
      return;
    }
    setOpenTermsBatchId(batchId);
    setLoadingTerms(true);
    try {
      const termsData = await getBatchTermById(batchId);
      setTerms(termsData.required_terms || []);
    } catch (err) {
      console.error("Error fetching terms for batch:", err);
      const errorMessage = err.response?.data?.message ||  "خطا در بارگذاری شرایط";
      toast.error(errorMessage);
    } finally {
      setLoadingTerms(false);
    }
  };

  const acceptTermsAndOpenSignup = async (batchId) => {
    const batch = batchesByCourse[openCourseId].find(b => b.id === batchId);
    setSelectedBatch(batch);
    setOpenTermsBatchId(null);
    setTerms([]);
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
      const errorMessage = err.response?.data?.message || "خطا در ثبت نام";
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
      const errorMessage = err.response?.data?.message || "خطا در ثبت نام";
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
      methods.push({
        key: "installment",
        label: `اقساط (${batch.installment_count} قسط)`,
        price: batch.price_installment,
      });
    }
    return methods.filter((m) => m.price !== null && m.price !== undefined);
  };

  if (loadingCourses) {
    return <LoadingSpinner />;
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
      <h1 className="text-4xl font-bold text-gray-800 md:mt-14 mb-8 tracking-tight">
        دوره‌ها
      </h1>
      {courses.map((course) => (
        <div
          key={course.id}
          className="w-full max-w-[820px] bg-white rounded-2xl shadow-md mb-8 p-6 border border-gray-200"
        >
          <button
            onClick={() => toggleCourse(course.id)}
            className="w-full relative text-right text-2xl  text-gray-800 hover:text-gray-900 focus:outline-none flex items-center justify-between"
          >
            {course.name}
            <p className="text-xl bg-blue-600 text-white px-4 py-1 rounded-full">
              نمایش
            </p>
          </button>
          {course.description && (
            <p className="text-gray-600 mt-2 text-right text-lg">
              {course.description}
            </p>
          )}
          {openCourseId === course.id && (
            <>
              <div className="mt-6 max-md:hidden grid grid-cols-7 gap-x-4 pr-6 text-base text-gray-800 text-right w-full max-w-3xl mx-auto font-semibold pb-3 border-b border-gray-200">
                <div className="pr-5">دوره</div>
                <div>محدوده سنی</div>
                <div>ظرفیت</div>
                <div>مکان</div>
                <div className="pr-6">شروع</div>
                <div className="pr-6">پایان</div>
                <div></div>
              </div>
              <div className="mt-4 space-y-4 max-w-3xl mx-auto">
                {batchesByCourse[course.id] &&
                batchesByCourse[course.id].filter(batch => batch.booking_open).length > 0 ? (
                  batchesByCourse[course.id].filter(batch => batch.booking_open).map((batch) => {
                    const season = getSeasonById(batch.season);
                    const paymentMethods = getPaymentMethods(batch);
                    return (
                      <div
                        key={batch.id}
                        className="bg-gray-50 rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:grid sm:grid-cols-7 gap-y-3 gap-x-8 text-base text-gray-800 text-right w-full">
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              دوره:{" "}
                            </span>
                            <span className="font-bold">{batch.title}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              محدوده سنی:{" "}
                            </span>
                            <span>
                              {batch.min_age} تا {batch.max_age} سال
                            </span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              ظرفیت:{" "}
                            </span>
                            <span>{batch.capacity} نفر</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              مکان:{" "}
                            </span>
                            <span>{batch.location}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              شروع:{" "}
                            </span>
                            <span>{season ? convertToJalali(season.start_date) : ""}</span>
                          </div>
                          <div className="flex sm:block">
                            <span className="font-semibold block sm:hidden w-24">
                              پایان:{" "}
                            </span>
                            <span>{season ? convertToJalali(season.end_date) : ""}</span>
                          </div>
                          <div className="flex sm:block">
                            <button
                              onClick={() => toggleTermsModal(batch.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none transition-colors"
                            >
                              ثبت نام
                            </button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {openTermsBatchId === batch.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
                            >
                              <motion.div
                                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 relative max-h-[80vh] overflow-y-auto"
                              >
                                <button
                                  onClick={() => setOpenTermsBatchId(null)}
                                  className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                                >
                                  <IoClose className="text-2xl" />
                                </button>
                                {loadingTerms ? (
                                  <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-right">
                                      شرایط و قوانین
                                    </h3>
                                    {terms.length === 0 ? (
                                      <p className="text-gray-600 text-right">
                                        شرایطی برای این دوره یافت نشد.
                                      </p>
                                    ) : (
                                      <motion.ul
                                        className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 mb-6 space-y-3"
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        {terms.map((term) => (
                                          <motion.li
                                            key={term.id}
                                            className="p-4 rounded-lg bg-white shadow-sm border border-gray-100"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            <h4 className="font-semibold text-lg">{term.title}</h4>
                                            <p className="text-gray-600 mt-1">{term.body}</p>
                                          </motion.li>
                                        ))}
                                      </motion.ul>
                                    )}
                                    <motion.button
                                      onClick={() => acceptTermsAndOpenSignup(batch.id)}
                                      className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      پذیرش شرایط و ادامه
                                    </motion.button>
                                  </>
                                )}
                              </motion.div>
                            </motion.div>
                          )}
                          {openSignupBatchId === batch.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
                            >
                              <motion.div
                                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 relative max-h-[100vh] overflow-y-auto"
                              >
                                <button
                                  onClick={() => setOpenSignupBatchId(null)}
                                  className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
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
                                          className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                                          initial={{ height: 0 }}
                                          animate={{ height: "auto" }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {children.map((child) => (
                                            <motion.li
                                              key={child.id}
                                              className={`p-4 rounded-lg text-black cursor-pointer transition-colors ${
                                                selectedChildId === child.id
                                                  ? "bg-blue-100 border-blue-500 border"
                                                  : "hover:bg-gray-100"
                                              }`}
                                              onClick={() => setSelectedChildId(child.id)}
                                              whileHover={{ scale: 1.02 }}
                                              whileTap={{ scale: 0.98 }}
                                            >
                                              {child.first_name}
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
                                          className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                                          initial={{ height: 0 }}
                                          animate={{ height: "auto" }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {paymentMethods.map((method) => (
                                            <motion.li
                                              key={method.key}
                                              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                                selectedPaymentMethod === method.key
                                                  ? "bg-blue-100 border-blue-500 border"
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
                                    {selectedPaymentMethod === "installment" && selectedBatch?.installment_templates?.length > 0 && (
                                      <div className="mb-6">
                                        <h4 className="font-semibold text-lg mb-3 text-right">
                                          جزئیات اقساط
                                        </h4>
                                        <motion.ul
                                          className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-2"
                                          initial={{ height: 0 }}
                                          animate={{ height: "auto" }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <li className="grid grid-cols-3 gap-4 font-semibold text-gray-800 pb-2 border-b border-gray-200">
                                            <span>شماره قسط</span>
                                            <span>مبلغ</span>
                                            <span>سررسید</span>
                                          </li>
                                          {[...selectedBatch.installment_templates]
                                            .sort((a, b) => a.order - b.order)
                                            .map((template) => (
                                              <motion.li
                                                key={template.id}
                                                className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-white shadow-sm border border-gray-100"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <span>{template.title}</span>
                                                <span>{template.amount} تومان</span>
                                                <span>{convertToJalali(template.due_date)}</span>
                                              </motion.li>
                                            ))}
                                        </motion.ul>
                                      </div>
                                    )}
                                    <motion.button
                                      onClick={() => handleSignup(batch.id)}
                                      disabled={signupLoading}
                                      className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
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