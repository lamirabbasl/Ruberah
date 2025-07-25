import React from "react";
import { motion } from "framer-motion";
import InstallmentItem from "./InstallmentItem";

const BackCard = ({ reg, regDetails, receiptImages, confirmingPaymentIds, confirmedPaymentIds, handleConfirmPayment, installmentReceiptImages, handleApproveInstallmentPayment, setModalImage }) => {
  return (
    <div
      className="absolute w-full h-full p-5 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-y-auto"
      style={{
        backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
    >
      {regDetails ? (
        <>
          {reg.payment_method !== "installment" ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                رسید پرداخت
              </h3>
              <div className="flex flex-row-reverse gap-4">
                {reg.payment_status !== "paid" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={
                      confirmedPaymentIds.has(reg.id) ||
                      confirmingPaymentIds.has(reg.id)
                    }
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleConfirmPayment(reg.id);
                    }}
                    className={`px-5 py-2 rounded-lg text-white text-xl font-medium transition-all duration-200 ${
                      confirmedPaymentIds.has(reg.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {confirmingPaymentIds.has(reg.id)
                      ? "در حال تایید..."
                      : confirmedPaymentIds.has(reg.id)
                      ? "تایید شده"
                      : "تایید پرداخت"}
                  </motion.button>
                )}
                {receiptImages[reg.id] ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImage(receiptImages[reg.id]);
                    }}
                    className="px-3 py-2 rounded-xl text-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                  >
                    مشاهده رسید
                  </motion.button>
                ) : (
                  <p className="text-gray-500 text-sm">
                    رسید موجود نیست
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                جزئیات قسط
              </h3>
              <ul className="space-y-4">
                {regDetails.installments.map((inst) => (
                  <InstallmentItem
                    key={inst.id}
                    inst={inst}
                    regId={reg.id}
                    installmentReceiptImages={installmentReceiptImages}
                    handleApproveInstallmentPayment={handleApproveInstallmentPayment}
                    setModalImage={setModalImage}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-sm">
          در حال بارگذاری جزئیات...
        </p>
      )}
    </div>
  );
};

export default BackCard;