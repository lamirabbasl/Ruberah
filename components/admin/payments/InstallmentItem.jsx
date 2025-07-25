import React from "react";
import { motion } from "framer-motion";
import { convertToJalali } from "@/lib/utils/convertDate";

const InstallmentItem = ({ inst, regId, installmentReceiptImages, handleApproveInstallmentPayment, setModalImage }) => {
  return (
    <li
      className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm"
    >
      <div className="space-y-2 text-xl">
        <p className="">
          مبلغ:
          <span className="mr-2">{inst.amount}</span>
        </p>
        <p className="">
          وضعیت:
          <span
            className={`px-2 py-1 rounded-full mr-2 text-xs ${
              inst.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {inst.status === "unpaid" ? "پرداخت نشده" : inst.status === "pending" ? "در انتظار" : inst.status === "paid" ? "پرداخت شده" : inst.status}
          </span>
        </p>
        <p className="">
          سررسید:
          <span className="mr-2">
            {convertToJalali(inst.due_date)}
          </span>
        </p>
      </div>
      {inst.secure_url && (
        <div className="flex flex-row-reverse gap-4 items-center space-x-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setModalImage(
                installmentReceiptImages[inst.id] ||
                "/path/to/fallback-receipt.jpg"
              );
            }}
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-lg font-medium"
          >
            مشاهده رسید
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={inst.status === "paid"}
            onClick={async (e) => {
              e.stopPropagation();
              await handleApproveInstallmentPayment(inst.id, regId);
            }}
            className={`px-4 py-2 rounded-lg text-white text-lg font-medium transition-all duration-200 ${
              inst.status === "paid"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            تایید پرداخت
          </motion.button>
        </div>
      )}
    </li>
  );
};

export default InstallmentItem;