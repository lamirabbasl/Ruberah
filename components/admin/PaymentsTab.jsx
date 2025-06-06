"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  getRegistrationsAdmin,
  getChildByIdAdmin,
  getBatches,
  getRegistrationDetailsById,
  getInstallmentDetailsRegistrationId,
  getInstallmentReceiptImageAdmin,
  approveInstallmentPayment,
  getReceiptImageAdmin,
  confirmPaymentNonInstallment,
} from "@/lib/api/api";

const PaymentsTab = () => {
  const [registrations, setRegistrations] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatches, setExpandedBatches] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [registrationDetailsMap, setRegistrationDetailsMap] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const [confirmingPaymentIds, setConfirmingPaymentIds] = useState(new Set());
  const [confirmedPaymentIds, setConfirmedPaymentIds] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const regs = await getRegistrationsAdmin();
        setRegistrations(regs);

        const batchesData = await getBatches();
        setBatches(batchesData);

        const uniqueChildIds = [...new Set(regs.map((r) => r.child))];
        const childrenData = {};
        await Promise.all(
          uniqueChildIds.map(async (childId) => {
            try {
              const child = await getChildByIdAdmin(childId);
              childrenData[childId] = child;
            } catch (e) {
              childrenData[childId] = { full_name: "نامشخص" };
            }
          })
        );
        setChildrenMap(childrenData);
      } catch (err) {
        setError("خطا در دریافت اطلاعات پرداخت‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedByBatch = {};
  registrations.forEach((reg) => {
    const batch = batches.find((b) => b.id === reg.batch);
    const batchTitle = batch ? batch.title : "بچ نامشخص";
    if (!groupedByBatch[batchTitle]) {
      groupedByBatch[batchTitle] = [];
    }
    groupedByBatch[batchTitle].push(reg);
  });

  const toggleBatch = (batchTitle) => {
    setExpandedBatches((prev) => ({
      ...prev,
      [batchTitle]: !prev[batchTitle],
    }));
  };

  const toggleFlipCard = async (regId) => {
    if (flippedCards[regId]) {
      setFlippedCards((prev) => ({ ...prev, [regId]: false }));
      return;
    }

    if (!registrationDetailsMap[regId]) {
      try {
        const regDetails = await getRegistrationDetailsById(regId);
        const installmentDetails = await getInstallmentDetailsRegistrationId(regId);
        regDetails.installments = installmentDetails;
        setRegistrationDetailsMap((prev) => ({
          ...prev,
          [regId]: regDetails,
        }));
      } catch (error) {
        console.error("Error fetching registration details or installments", error);
      }
    }

    setFlippedCards((prev) => ({ ...prev, [regId]: true }));
  };

  const handleConfirmPayment = async (regId) => {
    if (confirmingPaymentIds.has(regId)) return;
    setConfirmingPaymentIds((prev) => new Set(prev).add(regId));
    try {
      await confirmPaymentNonInstallment(regId);
      setConfirmedPaymentIds((prev) => new Set(prev).add(regId));
      alert("پرداخت با موفقیت تایید شد");
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("خطا در تایید پرداخت");
    } finally {
      setConfirmingPaymentIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(regId);
        return newSet;
      });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">پرداخت‌ها</h2>
      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : registrations.length === 0 ? (
        <p className="text-center text-gray-600">هیچ ثبت‌نامی یافت نشد.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByBatch).map(([batchTitle, regs]) => (
            <motion.div
              key={batchTitle}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="border border-gray-200 rounded-xl bg-white shadow-md"
            >
              <button
                onClick={() => toggleBatch(batchTitle)}
                className="w-full text-right px-5 py-3 font-semibold text-lg bg-gray-100 hover:bg-gray-200 rounded-t-xl focus:outline-none transition-colors"
              >
                {batchTitle}
              </button>
              <AnimatePresence>
                {expandedBatches[batchTitle] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5"
                  >
                    {regs.map((reg) => {
                      const child = childrenMap[reg.child];
                      const batch = batches.find((b) => b.id === reg.batch);
                      const isFlipped = flippedCards[reg.id];
                      const regDetails = registrationDetailsMap[reg.id];

                      return (
                        <motion.div
                          key={reg.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          className="relative border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow bg-white"
                          style={{ height: "300px", perspective: "1000px" }}
                          onClick={() => toggleFlipCard(reg.id)}
                        >
                          <div
                            className="relative w-full h-full"
                            style={{
                              transformStyle: "preserve-3d",
                              transition: "transform 0.7s",
                              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                              height: "100%",
                            }}
                          >
                            {/* Front Side */}
                            <div
                              className="absolute w-full h-full p-4 overflow-y-auto"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {child ? child.full_name : "نامشخص"}
                              </h3>
                              {batch ? (
                                <>
                                  <p className="text-gray-600 text-sm">برنامه: {batch.schedule || "-"}</p>
                                  <p className="text-gray-600 text-sm">ظرفیت: {batch.capacity}</p>
                                </>
                              ) : (
                                <p className="text-gray-600 text-sm">بچه نامشخص</p>
                              )}
                              <p className="text-gray-600 text-sm mt-2">
                                وضعیت پرداخت: {reg.payment_status}
                              </p>
                              <p className="text-gray-600 text-sm">مبلغ نهایی: {reg.final_price}</p>
                            </div>

                            {/* Back Side */}
                            <div
                              className="absolute w-full h-full p-4 bg-gray-50 overflow-y-auto"
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                              {regDetails ? (
                                <>
                                  {reg.payment_method !== "installment" ? (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-semibold text-gray-800 mb-2">رسید پرداخت</h3>
                                      {getReceiptImageAdmin(reg.id) ? (
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setModalImage(getReceiptImageAdmin(reg.id));
                                          }}
                                          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                        >
                                          مشاهده رسید
                                        </motion.button>
                                      ) : (
                                        <p className="text-gray-500 text-sm">رسید موجود نیست</p>
                                      )}
                                      {reg.payment_status !== "paid" && (
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          disabled={confirmedPaymentIds.has(reg.id) || confirmingPaymentIds.has(reg.id)}
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await handleConfirmPayment(reg.id);
                                          }}
                                          className={`px-4 py-2 rounded-lg text-white ${
                                            confirmedPaymentIds.has(reg.id)
                                              ? "bg-gray-400 cursor-not-allowed"
                                              : "bg-green-600 hover:bg-green-700"
                                          } transition`}
                                        >
                                          {confirmingPaymentIds.has(reg.id)
                                            ? "در حال تایید..."
                                            : confirmedPaymentIds.has(reg.id)
                                            ? "تایید شده"
                                            : "تایید پرداخت"}
                                        </motion.button>
                                      )}
                                    </div>
                                  ) : (
                                    <>
                                      <h3 className="text-lg font-semibold text-gray-800 mb-2">جزئیات ثبت‌نام</h3>
                                      <ul className="space-y-3">
                                        {regDetails.installments.map((inst) => (
                                          <li key={inst.id} className="text-sm text-gray-600">
                                            <p>مبلغ: {inst.amount}</p>
                                            <p>وضعیت: {inst.status}</p>
                                            <p>تاریخ سررسید: {inst.due_date}</p>
                                            {inst.secure_url && (
                                              <div className="flex items-center space-x-3 mt-2">
                                                <motion.button
                                                  whileHover={{ scale: 1.05 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalImage(getInstallmentReceiptImageAdmin(inst.id));
                                                  }}
                                                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                                >
                                                  مشاهده رسید
                                                </motion.button>
                                                <motion.button
                                                  whileHover={{ scale: 1.05 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  disabled={inst.status === "paid"}
                                                  onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                      await approveInstallmentPayment(inst.id);
                                                      setRegistrationDetailsMap((prev) => {
                                                        const updated = { ...prev };
                                                        const regDetails = updated[reg.id];
                                                        if (regDetails) {
                                                          const instIndex = regDetails.installments.findIndex(
                                                            (i) => i.id === inst.id
                                                          );
                                                          if (instIndex !== -1) {
                                                            regDetails.installments[instIndex].status = "paid";
                                                          }
                                                        }
                                                        return updated;
                                                      });
                                                    } catch (error) {
                                                      console.error("Failed to approve payment", error);
                                                      alert("خطا در تایید پرداخت");
                                                    }
                                                  }}
                                                  className={`px-3 py-1 rounded-lg text-white ${
                                                    inst.status === "paid"
                                                      ? "bg-gray-400 cursor-not-allowed"
                                                      : "bg-green-600 hover:bg-green-700"
                                                  } transition`}
                                                >
                                                  تایید پرداخت
                                                </motion.button>
                                              </div>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </>
                                  )}
                                </>
                              ) : (
                                <p className="text-gray-600 text-sm">در حال بارگذاری جزئیات...</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-6 rounded-xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={modalImage} alt="Receipt Large" className="max-w-full max-h-[80vh]" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalImage(null)}
                className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                بستن
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsTab;