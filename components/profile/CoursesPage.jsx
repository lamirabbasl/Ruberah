"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getRegistrations,
  getChildById,
  getChildPhotoUrl,
  getBatchById,
  getSeasons,
  getRegistrationInstallments,
  uploadInstallmentPayment,
  getInstallmentReceiptImage,
  getReceiptImage,
  UploadReceiptPicture
} from "@/lib/api/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChildCard from "@/components/profile/courses/ChildCard";

function CoursesPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedImages, setFetchedImages] = useState({});

  // Initial data fetching
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
            childDataMap[reg.child] = {
              id: reg.child,
              name: childInfo.full_name || "نامشخص",
              image: null,
              courses: [],
            };
          }

          let batchInfo = null;
          try {
            batchInfo = await getBatchById(reg.batch);
          } catch (e) {
            console.error("Error fetching batch info for batch", reg.batch, e);
            const errorMessage = e.response?.data?.message || e.message || "خطا در دریافت اطلاعات";
            toast.error(errorMessage);
          }

          let installments = [];
          try {
            installments = await getRegistrationInstallments(reg.id);
            installments = installments.map((inst) => ({
              ...inst,
              receiptUrl: null,
              batchId: reg.batch, // Add batchId to installments
            }));
          } catch (e) {
            console.error("Error fetching installments for registration", reg.id, e);
            const errorMessage = e.response?.data?.message || e.message || "خطا در دریافت اقساط";
            toast.error(errorMessage);
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
            id: reg.id,
            name: batchInfo ? batchInfo.title : "دوره ثبت‌نام شده",
            start: seasonInfo ? seasonInfo.start_date : "نامشخص",
            end: seasonInfo ? seasonInfo.end_date : "نامشخص",
            paid: paymentStatus === "paid",
            receiptUrl: reg.secure_url || null,
            paymentInfo: {
              time: reg.registered_at,
              amount: reg.final_price,
              location: batchInfo ? batchInfo.location : "نامشخص",
              paymentMethod: paymentStatus === "paid" ? "پرداخت کامل" : reg.payment_method === "installment" ? "اقساط" : "رسید",
              paymentmetoo: reg.payment_method,
              selected_payment_account: reg.selected_payment_account,
              installments: installments,
            },
            installments: installments,
            batchId: reg.batch,
          });
        }

        setChildren(Object.values(childDataMap));
      } catch (error) {
        console.error("Error fetching registrations or children:", error);
        const errorMessage = error.response?.data?.message || error.message || "خطا در دریافت فرزندان";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch child photos
  useEffect(() => {
    async function fetchChildPhotos() {
      const updatedChildren = await Promise.all(
        children.map(async (child) => {
          if (!fetchedImages[`child-${child.id}`]) {
            try {
              const photoUrl = await getChildPhotoUrl(child.id);
              setFetchedImages((prev) => ({ ...prev, [`child-${child.id}`]: true }));
              return { ...child, image: photoUrl };
            } catch (err) {
              setFetchedImages((prev) => ({ ...prev, [`child-${child.id}`]: true }));
              const errorMessage = err.response?.data?.message || err.message || "خطا در عکس فرزندان";
              toast.error(errorMessage);
              return { ...child, image: "/path/to/fallback-image.jpg" };
            }
          }
          return child;
        })
      );
      setChildren(updatedChildren);
    }

    if (children.length > 0) {
      fetchChildPhotos();
    }
  }, [children.length]);

  // Fetch receipt images
  useEffect(() => {
    async function fetchReceiptImages() {
      const updatedChildren = await Promise.all(
        children.map(async (child) => ({
          ...child,
          courses: await Promise.all(
            child.courses.map(async (course) => {
              let updatedCourse = { ...course };
              if (!course.paid && course.receiptUrl === null && !fetchedImages[`registration-${course.id}`]) {
                try {
                  const receiptUrl = await getReceiptImage(course.id);
                  setFetchedImages((prev) => ({ ...prev, [`registration-${course.id}`]: true }));
                  updatedCourse = { ...course, receiptUrl };
                } catch (err) {
                  setFetchedImages((prev) => ({ ...prev, [`registration-${course.id}`]: true }));
                  updatedCourse = { ...course, receiptUrl: null };
                }
              }

              if (course.installments?.length > 0) {
                const updatedInstallments = await Promise.all(
                  course.installments.map(async (inst) => {
                    if (inst.secure_url !== null && !fetchedImages[`installment-${inst.id}`]) {
                      try {
                        const receiptUrl = await getInstallmentReceiptImage(inst.id);
                        setFetchedImages((prev) => ({ ...prev, [`installment-${inst.id}`]: true }));
                        return { ...inst, receiptUrl };
                      } catch (err) {
                        setFetchedImages((prev) => ({ ...prev, [`installment-${inst.id}`]: true }));
                        if (err.status !== 404) {
                          // Handle non-404 errors if needed
                        }
                        return { ...inst, receiptUrl: null };
                      }
                    }
                    return inst;
                  })
                );
                return {
                  ...updatedCourse,
                  installments: updatedInstallments,
                  paymentInfo: { ...updatedCourse.paymentInfo, installments: updatedInstallments },
                };
              }
              return updatedCourse;
            })
          ),
        }))
      );
      setChildren(updatedChildren);
    }

    if (children.length > 0) {
      fetchReceiptImages();
    }
  }, [children.length]);

  const handleImageUpload = async (e, registrationId, installmentId = null, paymentAccount = null) => {
    e.preventDefault();
    const fileInput = e.target.elements.receipt_image;
    if (fileInput.files.length === 0) {
      const errorMessage = "لطفا یک فایل تصویر انتخاب کنید";
      toast.error(errorMessage);
      return;
    }

    try {
      if (installmentId) {
        const response = await uploadInstallmentPayment(installmentId, fileInput.files[0], paymentAccount);
        const successMessage = response.data?.message || "رسید با موفقیت بارگذاری شد.";
        toast.success(successMessage);
        const updatedInstallments = await getRegistrationInstallments(registrationId);
        const updatedInstallmentsWithReceipts = await Promise.all(
          updatedInstallments.map(async (inst) => {
            if (inst.secure_url !== null) {
              try {
                const receiptUrl = await getInstallmentReceiptImage(inst.id);
                setFetchedImages((prev) => ({ ...prev, [`installment-${inst.id}`]: true }));
                return { ...inst, receiptUrl, batchId: inst.batchId };
              } catch (err) {
                setFetchedImages((prev) => ({ ...prev, [`installment-${inst.id}`]: true }));
                if (err.status !== 404) {
                  // Handle non-404 errors if needed
                }
                return { ...inst, receiptUrl: null, batchId: inst.batchId };
              }
            }
            return { ...inst, batchId: inst.batchId };
          })
        );

        setChildren((prevChildren) =>
          prevChildren.map((child) => ({
            ...child,
            courses: child.courses.map((course) =>
              course.id === registrationId
                ? {
                    ...course,
                    installments: updatedInstallmentsWithReceipts,
                    paymentInfo: {
                      ...course.paymentInfo,
                      installments: updatedInstallmentsWithReceipts,
                    },
                  }
                : course
            ),
          }))
        );
      } else {
        const response = await UploadReceiptPicture(registrationId, fileInput.files[0], paymentAccount);
        const successMessage = response.data?.message || "رسید با موفقیت بارگذاری شد.";
        toast.success(successMessage);
        const receiptUrl = await getReceiptImage(registrationId);
        setFetchedImages((prev) => ({ ...prev, [`registration-${registrationId}`]: true }));

        setChildren((prevChildren) =>
          prevChildren.map((child) => ({
            ...child,
            courses: child.courses.map((course) =>
              course.id === registrationId
                ? { ...course, receiptUrl }
                : course
            ),
          }))
        );
      }
    } catch (error) {
      console.error("Error uploading receipt:", error);
      const errorMessage = error.response?.data?.message || error.message || "خطا در بارگذاری رسید";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen font-mitra p-6 flex flex-col items-center"
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
      <h1 className="text-4xl font-bold text-gray-700 mb-6">دوره‌های فرزندان</h1>
      {children.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">هیچ دوره‌ای ثبت نشده است.</p>
      ) : (
        children.map((child, childIndex) => (
          <ChildCard
            key={childIndex}
            child={child}
            childIndex={childIndex}
            handleImageUpload={handleImageUpload}
          />
        ))
      )}
    </div>
  );
}

export default CoursesPage;