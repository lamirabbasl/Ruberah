"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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

function CoursesPage() {
  const [openCourseIdx, setOpenCourseIdx] = useState({});
  const [children, setChildren] = useState([]);
  const [batchesMap, setBatchesMap] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const toggleCourse = (childIndex, courseIndex) => {
    const key = `${childIndex}-${courseIndex}`;
    setOpenCourseIdx((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    async function fetchData() {
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

        // Map to hold childId to child data
        const childDataMap = {};

        for (const reg of registrations) {
          if (!childDataMap[reg.child]) {
            const childInfo = await getChildById(reg.child);
            const photoUrl = getChildPhotoUrl(reg.child);

            childDataMap[reg.child] = {
              id: reg.child,
              name: childInfo.full_name || "نامشخص",
              image: photoUrl,
              courses: [],
            };
          }

          // Fetch batch info
          let batchInfo = null;
          try {
            batchInfo = await getBatchById(reg.batch);
          } catch (e) {
            console.error("Error fetching batch info for batch", reg.batch, e);
          }

          // Fetch installments for registration
          let installments = [];
          try {
            installments = await getRegistrationInstallments(reg.id);
          } catch (e) {
            console.error("Error fetching installments for registration", reg.id, e);
          }

          // Determine payment status based on installments
          let paymentStatus = "unpaid";
          if (installments.length > 0) {
            const allPaid = installments.every(inst => inst.status === "paid");
            const allUnpaid = installments.every(inst => inst.status !== "paid");
            if (allPaid) paymentStatus = "paid";
            else if (allUnpaid) paymentStatus = "unpaid";
            else paymentStatus = "partial";
          } else {
            paymentStatus = reg.payment_status === "paid" ? "paid" : "unpaid";
          }

          // Get season info from batch
          const seasonInfo = batchInfo && batchInfo.season ? seasonMap[batchInfo.season] : null;

          childDataMap[reg.child].courses.push({
            name: batchInfo ? batchInfo.title : "دوره ثبت‌نام شده",
            // Removed teacher field as per user request
            start: seasonInfo ? seasonInfo.start_date : "نامشخص",
            end: seasonInfo ? seasonInfo.end_date : "نامشخص",
            paid: paymentStatus === "paid",
            image: "/testimages/n1.jpg", // placeholder image, can be improved
            paymentInfo: {
              time: reg.registered_at,
              amount: reg.final_price,
              code: "کد پرداخت نامشخص",
              location: batchInfo ? batchInfo.location : "نامشخص",
              paymentMethod: paymentStatus === "paid" ? "پرداخت کامل" : "اقساط",
              installments: installments,
            },
            installments: installments,
          });
        }

        const childrenArray = Object.values(childDataMap);
        setChildren(childrenArray);
      } catch (error) {
        console.error("Error fetching registrations or children:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen font-mitra p-6 flex flex-col items-center"
    >
      <h1 className="text-4xl font-bold text-gray-700 mb-6">
        دوره‌های فرزندان
      </h1>

      {children.map((child, childIndex) => (
        <div
          key={childIndex}
          className="w-screen max-w-3xl bg-gray-100 rounded-xl shadow-lg mb-8 p-5"
        >
          {/* فرزند */}
          <div className="flex items-center mb-4 gap-4">
            <Image
              src={child.image || getChildPhotoUrl(child.id)}
              alt={child.name}
              width={70}
              height={70}
              className="w-22 h-22 rounded-full object-cover border-2 border-blue-500 shadow"
            />
            <h2 className="text-2xl font-bold text-gray-800">{child.name}</h2>
          </div>

          {/* عنوان جدول */}
          <div className="hidden sm:flex justify-between items-center pr-6 bg-gray-100 border-b-2 border-gray-200 p-3 rounded-t-lg text-lg text-gray-600 font-semibold text-right">
            <div className="flex flex-wrap gap-x-6 mr-8 gap-y-1">
              <span className="w-20">دوره</span>
              <span className="w-24">شروع</span>
              <span className="w-20">پایان</span>
              <span className="w-20">مکان</span>
              <span className="w-24">وضعیت پرداخت</span>
            </div>
          </div>

          {/* دوره‌ها */}
          <div className="space-y-3 mt-2">
            {child.courses.map((course, courseIndex) => {
              const key = `${childIndex}-${courseIndex}`;
              const isOpen = openCourseIdx[key];
              const isInstallment =  course.installments;

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
                          مکان:{" "}
                        </span>
                        <span className="font-semibold">{course.paymentInfo?.location}</span>
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
                    <div className=" max-md:absolute  left-4 top-6   flex justify-center">
                      <span className="font-semibold block sm:hidden w-20">
                        روش پرداخت:{" "}
                      </span>
                      <span className="font-semibold">{course.paymentInfo?.paymentMethod}</span>
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
                              <div className="flex flex-col max-md:hidden sm:flex-row sm:justify-between sm:items-center bg-gray-200 rounded-md p-3 shadow text-sm gap-2 sm:gap-0 font-semibold text-gray-700">
                                <span>قسط</span>
                                <span>مبلغ</span>
                                <span>وضعیت پرداخت</span>
                                <span>مهلت پرداخت</span>
                                <span></span>
                              </div>
                              {course.installments.map((inst, idx) => {
                                const isPaid = inst.status === "paid";
                                const isImg = inst.secure_url !== null
                                return (
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
                                  className={
                                    isPaid ? "text-green-600" : "text-red-500"
                                  }
                                  >
                                    {isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
                                  </span>
                                  <span className="text-gray-600">
                                    مهلت: {inst.due_date}
                                  </span>
                                  <span>
                                    { isImg ? (
                                      <img
                                        src={getInstallmentReceiptImage(inst.id)}
                                        alt={`رسید قسط ${idx + 1}`}
                                        className="h-12 rounded-md"
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
                                            // Refresh installments after upload
                                            const updatedInstallments = await getRegistrationInstallments(course.id);
                                            course.installments = updatedInstallments;
                                            setOpenCourseIdx((prev) => ({ ...prev }));
                                          } catch (error) {
                                            alert("خطا در بارگذاری تصویر پرداخت");
                                          }
                                        } else {
                                          alert("لطفا یک فایل تصویر انتخاب کنید");
                                        }
                                      }}
                                    >
                                      <input
                                        type="file"
                                        name="receipt_image"
                                        accept="image/*"
                                        className="mb-2"
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
                            <span className="">زمان پرداخت:</span>{" "}
                            {course.paymentInfo?.time}
                          </div>
                          <div className="flex gap-4">
                            <span className="">مبلغ کل:</span>{" "}
                            {course.paymentInfo?.amount}
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
