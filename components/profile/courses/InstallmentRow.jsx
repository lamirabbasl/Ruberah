import React, { useState } from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import ReceiptUploadForm from "./ReceiptUploadForm";

function InstallmentRow({ installment, index, registrationId, handleImageUpload }) {
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);
  const isPaid = installment.status === "paid";
  const isImg = installment.secure_url !== null;

  return (
    <div
      className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-md p-3 shadow sm:text-lg gap-2 sm:gap-0"
    >
      <span className="text-gray-700 font-semibold w-20">قسط {index + 1}</span>
      <span className="text-gray-700 w-20">{installment.amount}</span>
      <span className={`w-24 ${isPaid ? "text-green-600" : "text-red-500"}`}>
        {isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
      </span>
      <span className="text-gray-600 w-24">
        مهلت: {convertToJalali(installment.due_date)}
      </span>
      <span className="w-40 flex flex-col items-center">
        {isImg && installment.receiptUrl ? (
          <img
            src={installment.receiptUrl}
            alt={`رسید قسط ${index + 1}`}
            className="h-20 rounded-md mx-auto"
          />
        ) : null}
        {uploadingInstallmentId !== installment.id && (
          <button
            onClick={() => setUploadingInstallmentId(installment.id)}
            className="px-4 py-1 rounded text-sm bg-blue-500 text-white hover:bg-blue-600 mt-1"
          >
            بارگذاری رسید
          </button>
        )}
        {uploadingInstallmentId === installment.id && (
          <ReceiptUploadForm
            registrationId={registrationId}
            installmentId={installment.id}
            setUploading={setUploadingInstallmentId}
            handleImageUpload={handleImageUpload}
          />
        )}
      </span>
    </div>
  );
}

export default InstallmentRow;