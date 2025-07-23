import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegistrationCard from "./RegistrationCard";

const BatchSection = ({ batchTitle, regs, expandedBatches, toggleBatch, childrenMap, batches, flippedCards, toggleFlipCard, registrationDetailsMap, receiptImages, confirmingPaymentIds, confirmedPaymentIds, handleConfirmPayment, installmentReceiptImages, handleApproveInstallmentPayment, setModalImage }) => {
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
      <button
        onClick={() => toggleBatch(batchTitle)}
        className="w-full text-right px-6 py-4 font-semibold text-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-t-2xl focus:outline-none transition-all duration-300 flex justify-between items-center"
      >
        <motion.span
          animate={{ rotate: expandedBatches[batchTitle] ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-indigo-600"
        >
          ▼
        </motion.span>
        <span>{batchTitle}</span>
      </button>
      <AnimatePresence>
        {expandedBatches[batchTitle] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
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
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BatchSection;