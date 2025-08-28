import React, { useState, useEffect } from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import InstallmentRow from "@/components/profile/courses/InstallmentRow";
import ReceiptUploadForm from "@/components/profile/courses/ReceiptUploadForm";
import { getBatchBankAccountById } from "@/lib/api/api";
import { toast } from "react-toastify";

function CourseDetails({ course, handleImageUpload, isBankModalOpen, setIsBankModalOpen }) {
  const isInstallment = course.paymentInfo.paymentmetoo === "installment";
  const [bankAccounts, setBankAccounts] = useState([]);
  const [uploadingRegistrationId, setUploadingRegistrationId] = useState(null);

  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        const accounts = await getBatchBankAccountById(course.batchId);
        setBankAccounts(accounts);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
        const errorMessage = error.response?.data?.message || "خطا در دریافت حساب‌های بانکی";
      }
    }
    fetchBankAccounts();
  }, [course.batchId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("شماره کپی شد!");
    }).catch(() => {
      toast.error("خطا در کپی کردن شماره");
    });
  };

  // Sort installments by id in ascending order
  const sortedInstallments = [...course.installments].sort((a, b) => a.id - b.id);

  return (
    <div className="bg-white mt-4 text-black rounded-2xl border border-gray-100 p-6 shadow-md text-right space-y-6">
      {isBankModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-right relative">
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="absolute top-4 left-4 text-red-500 hover:text-red-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">حساب‌های بانکی</h3>
            {bankAccounts.length > 0 ? (
              bankAccounts.map((account) => (
                <div key={account.id} className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">نام حساب: {account.display_name}</p>
                    <button onClick={() => copyToClipboard(account.display_name)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">بانک: {account.bank_name}</p>
                    <button onClick={() => copyToClipboard(account.bank_name)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">شماره شبا: {account.iban}</p>
                    <button onClick={() => copyToClipboard(account.iban)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">شماره حساب: {account.account_number}</p>
                    <button onClick={() => copyToClipboard(account.account_number)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">شماره کارت: {account.card_number}</p>
                    <button onClick={() => copyToClipboard(account.card_number)} className="text-gray-600 hover:text-gray-800">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">حساب بانکی یافت نشد.</p>
            )}
          </div>
        </div>
      )}
      {isInstallment ? (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 sm:block hidden">اطلاعات اقساط</h3>
          <div className="hidden sm:grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-xl font-semibold text-gray-900">
            <span>قسط</span>
            <span>مبلغ</span>
            <span>وضعیت پرداخت</span>
            <span>مهلت پرداخت</span>
            <span>رسید</span>
          </div>
          {sortedInstallments.map((inst, idx) => (
            <InstallmentRow
              key={inst.id}
              installment={inst}
              index={idx}
              registrationId={course.id}
              handleImageUpload={handleImageUpload}
              course = {course}
            />
          ))}
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 sm:block hidden">اطلاعات پرداخت</h3>
          <div className="hidden sm:grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl font-semibold text-gray-900">
            <span>مبلغ کل</span>
            <span>زمان پرداخت</span>
            <span>وضعیت پرداخت</span>
            <span>رسید</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow">
            <div className="flex items-center">
              <span className="block sm:hidden font-semibold w-24">مبلغ کل: </span>
              <span>{course.paymentInfo?.amount}</span>
            </div>
            <div className="flex items-center">
              <span className="block sm:hidden font-semibold w-24">زمان پرداخت: </span>
              <span>
                {course.paymentInfo?.time ? convertToJalali(course.paymentInfo.time.slice(0, 10)) : "نامشخص"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="block sm:hidden font-semibold w-24">وضعیت پرداخت: </span>
              <span className={`font-semibold ${course.paid ? "text-green-600" : "text-red-500"}`}>
                {course.paid ? "پرداخت شده" : "در انتظار پرداخت"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              {course.receiptUrl && (
                <img
                  src={course.receiptUrl}
                  alt="رسید پرداخت"
                  className="h-32 sm:h-24 rounded-lg shadow-md mb-2"
                />
              )}
              {!course.paid && (
                <button
                  onClick={() => setUploadingRegistrationId(course.id)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition duration-200 text-sm font-medium"
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CourseDetails;