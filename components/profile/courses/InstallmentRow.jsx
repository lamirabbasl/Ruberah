import React, { useState } from "react";
import { convertToJalali } from "@/lib/utils/convertDate";
import ReceiptUploadForm from "./ReceiptUploadForm";

function InstallmentRow({ installment, index, registrationId, handleImageUpload }) {
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);
  const isPaid = installment.status === "paid";
  const isImg = installment.receiptUrl !== null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow text-gray-800">
      <div className="flex items-center">
        <span className="block sm:hidden font-semibold w-20">قسط: </span>
        <span className="font-semibold">قسط {index + 1}</span>
      </div>
      <div className="flex items-center">
        <span className="block sm:hidden font-semibold w-20">مبلغ: </span>
        <span>{installment.amount}</span>
      </div>
      <div className="flex items-center">
        <span className="block sm:hidden font-semibold w-24">وضعیت پرداخت: </span>
        <span className={`font-semibold ${isPaid ? "text-green-600" : "text-red-500"}`}>
          {isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
        </span>
      </div>
      <div className="flex items-center">
        <span className="block sm:hidden font-semibold w-24">مهلت پرداخت: </span>
        <span>مهلت: {convertToJalali(installment.due_date)}</span>
      </div>
      <div className="flex flex-col items-center">
        {isImg && (
          <img
            src={installment.receiptUrl}
            alt={`رسید قسط ${index + 1}`}
            className="h-32 sm:h-24 rounded-lg shadow-md mb-2"
          />
        )}
        {!isPaid && (
          <button
            onClick={() => setUploadingInstallmentId(installment.id)}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition duration-200 text-sm font-medium"
          >
            {isImg ? "تغییر رسید" : "پرداخت"}
          </button>
        )}
        <ReceiptUploadForm
          registrationId={registrationId}
          installmentId={installment.id}
          setUploading={setUploadingInstallmentId}
          handleImageUpload={handleImageUpload}
          batchId={installment.batchId}
          isOpen={uploadingInstallmentId === installment.id}
          closeModal={() => setUploadingInstallmentId(null)}
        />
      </div>
    </div>
  );
}

export default InstallmentRow;