import React from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import InstallmentRow from "@/components/profile/courses/InstallmentRow";
import ReceiptUploadForm from "@/components/profile/courses/ReceiptUploadForm";

function CourseDetails({ course, handleImageUpload }) {
  const isInstallment = course.paymentInfo.paymentmetoo === "installment";

  return (
    <div className="bg-gray-50 mt-2 max-md:relative max-md:grid max-md:grid-cols-2 max-md:gap-4 rounded-lg border border-blue-100 p-4 text-right space-y-3 animate-fade-in">
      {isInstallment ? (
        <>
          <h3 className="text-lg max-md:hidden font-bold text-blue-700 mb-2">
            اطلاعات اقساط
          </h3>
          <div className="flex max-md:hidden flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-200 rounded-md p-3 shadow text-lg gap-2 sm:gap-0 text-gray-700">
            <span className="w-20">قسط</span>
            <span className="w-20">مبلغ</span>
            <span className="w-24">وضعیت پرداخت</span>
            <span className="w-24">مهلت پرداخت</span>
            <span className="w-40"></span>
          </div>
          {course.installments.map((inst, idx) => (
            <InstallmentRow
              key={idx}
              installment={inst}
              index={idx}
              registrationId={course.id}
              handleImageUpload={handleImageUpload}
            />
          ))}
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
          <div className="flex flex-col items-center">
            {course.receiptUrl ? (
              <img
                src={course.receiptUrl}
                alt="رسید پرداخت"
                className="h-20 rounded-md mx-auto"
              />
            ) : null}
            <ReceiptUploadForm
              registrationId={course.id}
              handleImageUpload={handleImageUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;