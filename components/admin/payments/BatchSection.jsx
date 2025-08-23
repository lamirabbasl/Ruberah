import React from "react";
import { motion } from "framer-motion";
import RegistrationCard from "./RegistrationCard";

const BatchSection = ({ batchTitle, regs, childrenMap, batches, flippedCards, toggleFlipCard, registrationDetailsMap, receiptImages, confirmingPaymentIds, confirmedPaymentIds, handleConfirmPayment, installmentReceiptImages, handleApproveInstallmentPayment, setModalImage, rejectingReceiptIds, rejectedReceiptIds, rejectingInstallmentIds, rejectedInstallmentIds, rejectingSignupIds, rejectedSignupIds, requestRejectReceipt, requestRejectInstallment, requestRejectSignup, approvingSignupIds, handleApproveSignup }) => {
  return (
    <motion.div
      key={batchTitle}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      initial="hidden"
      animate="visible"
      className="border border-gray-200 rounded-2xl max-md:ml-4 shadow-lg overflow-hidden"
    >
      <div
        className="w-full text-right px-6 py-4 font-semibold text-xl bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl "
      >
        <span>{batchTitle}</span>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
      >
        {regs.map((reg) => (
          <RegistrationCard
            key={reg.id}
            reg={reg}
            child={childrenMap[reg.child]}
            batch={batches.find((b) => b.id === (reg.batch?.id || reg.batch))}
            isFlipped={flippedCards[reg.id]}
            toggleFlipCard={toggleFlipCard}
            regDetails={registrationDetailsMap[reg.id]}
            receiptImages={receiptImages}
            confirmingPaymentIds={confirmingPaymentIds}
            confirmedPaymentIds={confirmedPaymentIds}
            handleConfirmPayment={handleConfirmPayment}
            installmentReceiptImages={installmentReceiptImages}
            handleApproveInstallmentPayment={handleApproveInstallmentPayment}
            setModalImage={setModalImage}
            rejectingReceiptIds={rejectingReceiptIds}
            rejectedReceiptIds={rejectedReceiptIds}
            rejectingInstallmentIds={rejectingInstallmentIds}
            rejectedInstallmentIds={rejectedInstallmentIds}
            rejectingSignupIds={rejectingSignupIds}
            rejectedSignupIds={rejectedSignupIds}
            requestRejectReceipt={requestRejectReceipt}
            requestRejectInstallment={requestRejectInstallment}
            requestRejectSignup={requestRejectSignup}
            approvingSignupIds={approvingSignupIds}
            handleApproveSignup={handleApproveSignup}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BatchSection;