import React from "react";
import { motion } from "framer-motion";
import FrontCard from "./FrontCard";
import BackCard from "./BackCard";

const RegistrationCard = ({ reg, child, batch, isFlipped, toggleFlipCard, regDetails, receiptImages, confirmingPaymentIds, confirmedPaymentIds, handleConfirmPayment, installmentReceiptImages, handleApproveInstallmentPayment, setModalImage }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      initial="hidden"
      animate="visible"
      className="relative border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white cursor-pointer"
      style={{ height: "320px", perspective: "1200px" }}
      onClick={() => toggleFlipCard(reg.id)}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          height: "100%",
        }}
      >
        <FrontCard reg={reg} child={child} batch={batch} />
        <BackCard
          reg={reg}
          regDetails={regDetails}
          receiptImages={receiptImages}
          confirmingPaymentIds={confirmingPaymentIds}
          confirmedPaymentIds={confirmedPaymentIds}
          handleConfirmPayment={handleConfirmPayment}
          installmentReceiptImages={installmentReceiptImages}
          handleApproveInstallmentPayment={handleApproveInstallmentPayment}
          setModalImage={setModalImage}
        />
      </div>
    </motion.div>
  );
};

export default RegistrationCard;