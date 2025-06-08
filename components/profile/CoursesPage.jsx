"use client";
import React, { useState, useEffect } from "react";
import {
  getRegistrations,
  getChildById,
  getChildPhotoUrl,
  getBatchById,
  getSeasons,
  getRegistrationInstallments,
  uploadInstallmentPayment,
  getInstallmentReceiptImage,
} from "@/lib/api/api";
import { convertToJalali } from "@/lib/utils/convertDate";

function CoursesPage() {
  const [openCourseIdx, setOpenCourseIdx] = useState({});
  const [children, setChildren] = useState([]);
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleCourse = (childIndex, courseIndex) => {
    const key = `${childIndex}-${courseIndex}`;
    setOpenCourseIdx((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const registrations = await getRegistrations();
        const seasonsList = await getSeasons();
        const seasonMap = {};
        seasonsList.forEach((season) => {
          seasonMap[season.id] = {
            name: season.name,
            start_date: season.start_date,
            end_date: season.end_date,
          };
        });

        const childDataMap = {};

        for (const reg of registrations) {
          if (!childDataMap[reg.child]) {
            const childInfo = await getChildById(reg.child);
            let photoUrl;
            try {
              photoUrl = await getChildPhotoUrl(reg.child);
            } catch (err) {
              console.error("Error fetching child photo:", err);
              photoUrl = "/path/to/fallback-image.jpg";
            }

            childDataMap[reg.child] = {
              id: reg.child,
              name: childInfo.full_name || "نامشخص",
              image: photoUrl,
              courses: [],
            };
          }

          let batchInfo = null;
          try {
            batchInfo = await getBatchById(reg.batch);
          } catch (e) {
            console.error("Error fetching batch info for batch", reg.batch, e);
          }

          let installments = [];
          try {
            installments = await getRegistrationInstallments(reg.id);
            installments = await Promise.all(
              installments.map(async (inst) => {
                if ( inst.secure_url !== null) {
                  try {
                    const receiptUrl = await getInstallmentReceiptImage(inst.id);
                    return { ...inst, receiptUrl };
                  } catch (err) {
                    console.error("Error fetching receipt image for installment", inst.id, err);
                    return { ...inst, receiptUrl: null };
                  }
                }
                return inst;
              })
            );
          } catch (e) {
            console.error("Error fetching installments for registration", reg.id, e);
          }

          let paymentStatus = "unpaid";
          if (installments.length > 0) {
            const allPaid = installments.every((inst) => inst.status === "paid");
            const allUnpaid = installments.every((inst) => inst.status !== "paid");
            if (allPaid) paymentStatus = "paid";
            else if (allUnpaid) paymentStatus = "unpaid";
            else paymentStatus = "partial";
          } else {
            paymentStatus = reg.payment_status === "paid" ? "paid" : "unpaid";
          }

          const seasonInfo = batchInfo && batchInfo.season ? seasonMap[batchInfo.season] : null;

          childDataMap[reg.child].courses.push({
            name: batchInfo ? batchInfo.title : "دوره ثبت‌نام شده",
            start: seasonInfo ? seasonInfo.start_date : "نامشخص",
            end: seasonInfo ? seasonInfo.end_date : "نامشخص",
            paid: paymentStatus === "paid",
            image: "/testimages/n1.jpg",
            paymentInfo: {
              time: reg.registered_at,
              amount: reg.final_price,
              location: batchInfo ? batchInfo.location : "نامشخص",
              paymentMethod: paymentStatus === "paid" ? "پرداخت کامل" : "اقساط",
              paymentmetoo: reg.payment_method,
              installments: installments,
            },
            installments: installments,
          });
        }

        setChildren(Object.values(childDataMap));
      } catch (error) {
        console.error("Error fetching registrations or children:", error);
        setError("خطا در دریافت اطلاعات دوره‌ها یا فرزندان");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      children.forEach((child) => {
        if (child.image) {
          URL.revokeObjectURL(child.image);
        }
        child.courses.forEach((course) => {
          course.installments?.forEach((inst) => {

          });
        });
      });
    };
  }, []);

  if (loading) {
    return <p className="text-center mt-10">در حال بارگذاری...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen font-mitra p-6 flex flex-col items-center"
    >
      <h1 className="text-4xl font-bold text-gray-700 mb-6">دوره‌های فرزندان</h1>

      {children.map((child, childIndex) => (
        <div
          key={childIndex}
          className="w-screen max-w-3xl bg-gray-100 rounded-xl shadow-lg mb-8 p-5"
        >
          <div className="flex items-center mb-4 gap-4">
            <img
              src={child.image || "/path/to/fallback-image.jpg"}
              alt={child.name}
              width={70}
              height={70}
              className="w-22 h-22 rounded-full object-cover border-2 border-blue-500 shadow"
            />
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
          </div>

          <div className="hidden sm:flex justify-between items-center pr-6 bg-gray-100 border-b-2 border-gray-200 p-3 rounded-t-lg text-lg text-gray-600 font-semibold text-right">
            <div className="flex flex-wrap gap-x-6 mr-8 gap-y-1">
              <span className="w-20">دوره</span>
              <span className="w-24">شروع</span>
              <span className="w-20">پایان</span>
              <span className="w-20">مکان</span>
              <span className="w-24">وضعیت پرداخت</span>
            </div>
          </div>

          <div className="space-y-3 mt-2">
            {child.courses.map((course, courseIndex) => {
              const key = `${childIndex}-${courseIndex}`;
              const isOpen = openCourseIdx[key];
              const isInstallment = course.paymentInfo.paymentmetoo === "installment";

              return (
                <div key={courseIndex}>
                  <div
                    className="flex relative flex-col sm:flex-row sm:justify-between sm:items-center pr-4 sm:pr-6 bg-white rounded-lg shadow p-3 border hover:shadow-md transition cursor-pointer"
                    onClick={() => toggleCourse(childIndex, courseIndex)}
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-5 gap-y-2 gap-x-4 text-sm sm:text-base text-gray-800 text-right w-full">
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">دوره: </span>
                        <span className="font-bold">{course.name}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">شروع: </span>
                        <span>{convertToJalali(course.start)}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-20">پایان: </span>
                        <span>{convertToJalali(course.end)}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-24">مکان: </span>
                        <span className="font-semibold">{course.paymentInfo?.location}</span>
                      </div>
                      <div className="flex sm:block">
                        <span className="font-semibold block sm:hidden w-24">وضعیت پرداخت: </span>
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
                    <div className="bg-gray-50 mt-2 max-md:relative max-md:grid max-md:grid-cols-2 max-md:gap-4 rounded-lg border border-blue-100 p-4 text-right space-y-3 animate-fade-in">
                      {isInstallment ? (
                        <>
                          <h3 className="text-lg max-md:hidden font-bold text-blue-700 mb-2">
                            اطلاعات اقساط
                          </h3>
                          <div className="flex max-md:hidden flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-200 rounded-md p-3 shadow text-sm gap-2 sm:gap-0 font-semibold text-gray-700">
                            <span>قسط</span>
                            <span>مبلغ</span>
                            <span>وضعیت پرداخت</span>
                            <span>مهلت پرداخت</span>
                            <span></span>
                          </div>
                          {course.installments.map((inst, idx) => {
                            const isPaid = inst.status === "paid";
                            const isImg =  inst.secure_url !== null;

                            return (
                              <div
                                key={idx}
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-md p-3 shadow text-sm gap-2 sm:gap-0"
                              >
                                <span className="text-gray-700 font-semibold">قسط {idx + 1}</span>
                                <span className="text-gray-700">{inst.amount}</span>
                                <span className={isPaid ? "text-green-600" : "text-red-500"}>
                                  {isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
                                </span>
                                <span className="text-gray-600">
                                  مهلت: {convertToJalali(inst.due_date)}
                                </span>
                                <span>
                                  {isImg ? (
                                    <img
                                      src={inst.receiptUrl}
                                      alt={`رسید قسط ${idx + 1}`}
                                      className="h-12 rounded-md mx-auto"
                                    />
                                  ) : null}
                                  {uploadingInstallmentId !== inst.id && (
                                    <button
                                      onClick={() => {
                                        setUploadingInstallmentId(inst.id);
                                        setPreviewImage(null);
                                      }}
                                      className="px-4 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 mt-1"
                                    >
                                      بارگذاری رسید
                                    </button>
                                  )}
                                  {uploadingInstallmentId === inst.id && (
                                    <div>
                                      <form
                                        onSubmit={async (e) => {
                                          e.preventDefault();
                                          const fileInput = e.target.elements.receipt_image;
                                          if (fileInput.files.length > 0) {
                                            try {
                                              await uploadInstallmentPayment(inst.id, fileInput.files[0]);
                                              setUploadingInstallmentId(null);
                                              const updatedInstallments = await getRegistrationInstallments(course.id);
                                              course.installments = updatedInstallments;
                                              setOpenCourseIdx((prev) => ({ ...prev }));
                                            } catch (error) {
                                              window.location.reload();
                                            }
                                          } else {
                                            alert("لطفا یک فایل تصویر انتخاب کنید");
                                          }
                                        }}
                                      >
                                        <input
                                          id="receipt_image"
                                          type="file"
                                          name="receipt_image"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              const previewUrl = URL.createObjectURL(file);
                                              setPreviewImage(previewUrl);
                                            } else {
                                              setPreviewImage(null);
                                            }
                                          }}
                                        />
                                        <label
                                          htmlFor="receipt_image"
                                          className="block mb-2 cursor-pointer py-2 text-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                          {previewImage ? "فایل انتخاب شد" : "انتخاب کنید"}
                                        </label>
                                        {previewImage && (
                                          <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="mb-2 h-24 rounded-md object-cover"
                                          />
                                        )}
                                        <div className="flex gap-2">
                                          <button
                                            type="submit"
                                            className="px-4 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 mt-1"
                                          >
                                            بارگذاری رسید
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setUploadingInstallmentId(null);
                                              setPreviewImage(null);
                                            }}
                                            className="text-red-500 text-sm mt-1"
                                          >
                                            لغو
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="bg-white p-3 rounded-md shadow text-md flex flex-col sm:flex-row flex-wrap gap-4 text-black font-medium">
                          <div className="flex gap-4">
                            <span className="whitespace-nowrap">زمان پرداخت:</span>{" "}
                            {convertToJalali(course.paymentInfo?.time?.slice(0, 10))}
                          </div>
                          <div className="flex gap-4">
                            <span className="">مبلغ کل:</span> {course.paymentInfo?.amount}
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