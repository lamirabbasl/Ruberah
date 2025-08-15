import React, { useState, useEffect } from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import InstallmentRow from "@/components/profile/courses/InstallmentRow";
import ReceiptUploadForm from "@/components/profile/courses/ReceiptUploadForm";
import { getBatchBankAccountById } from "@/lib/api/api";
import { toast } from "react-toastify";

function CourseDetails({ course, handleImageUpload }) {
  const isInstallment = course.paymentInfo.paymentmetoo === "installment";
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showBankAccounts, setShowBankAccounts] = useState(false);
  const [uploadingRegistrationId, setUploadingRegistrationId] = useState(null);

  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        const accounts = await getBatchBankAccountById(course.batchId);
        setBankAccounts(accounts);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
        const errorMessage = error.response?.data?.message || error.message || "خطا در دریافت حساب‌های بانکی";
        toast.error(errorMessage);
      }
    }
    fetchBankAccounts();
  }, [course.batchId]);

  return (
    <div className="bg-gray-50 mt-2 max-md:relative max-md:grid max-md:grid-cols-2 max-md:gap-4 rounded-lg border border-blue-100 p-4 text-right space-y-3 animate-fade-in">
      <button
        onClick={() => setShowBankAccounts(!showBankAccounts)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        {showBankAccounts ? "مخفی کردن حساب‌های بانکی" : "نمایش حساب‌های بانکی"}
      </button>
      {showBankAccounts && (
        <div className="bg-white p-3 rounded-md text-black shadow text-md flex flex-col gap-4">
          {bankAccounts.length > 0 ? (
            bankAccounts.map((account) => (
              <div key={account.id} className="border-b pb-2">
                <p><strong>نام حساب:</strong> {account.display_name}</p>
                <p><strong>بانک:</strong> {account.bank_name}</p>
                <p><strong>شماره شبا:</strong> {account.iban}</p>
                <p><strong>شماره حساب:</strong> {account.account_number}</p>
                <p><strong>شماره کارت:</strong> {account.card_number}</p>
              </div>
            ))
          ) : (
            <p>حساب بانکی یافت نشد.</p>
          )}
        </div>
      )}
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
        <>
          <h3 className="text-lg max-md:hidden font-bold text-blue-700 mb-2">
            اطلاعات پرداخت
          </h3>
          <div className="flex max-md:hidden flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-200 rounded-md p-3 shadow text-lg gap-2 sm:gap-0 text-gray-700">
            <span className="w-20">مبلغ کل</span>
            <span className="w-24">زمان پرداخت</span>
            <span className="w-24">وضعیت پرداخت</span>
            <span className="w-40"></span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-md p-3 shadow text-md gap-2 sm:gap-0 text-black">
            <span className="w-20">{course.paymentInfo?.amount}</span>
            <span className="w-24">
              {course.paymentInfo?.time ? convertToJalali(course.paymentInfo.time.slice(0, 10)) : "نامشخص"}
            </span>
            <span className={`w-24 ${course.paid ? "text-green-600" : "text-red-500"}`}>
              {course.paid ? "پرداخت شده" : "در انتظار پرداخت"}
            </span>
            <span className="w-40 flex flex-col items-center">
              {course.receiptUrl && (
                <img
                  src={course.receiptUrl}
                  alt="رسید پرداخت"
                  className="h-20 rounded-md mx-auto mb-2"
                />
              )}
              {!course.paid && (
                <button
                  onClick={() => setUploadingRegistrationId(course.id)}
                  className="px-4 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 mt-1"
                >
                  {course.receiptUrl ? "تغییر رسید" : "پرداخت"}
                </button>
              )}
              <ReceiptUploadForm
                registrationId={course.id}
                handleImageUpload={handleImageUpload}
                batchId={course.batchId}
                isOpen={uploadingRegistrationId === course.id}
                closeModal={() => setUploadingRegistrationId(null)}
              />
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default CourseDetails;