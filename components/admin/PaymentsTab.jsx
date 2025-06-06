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
import { convertToJalali } from "@/lib/utils/convertDate";

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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  return (
    <div className="p-6 bg-gradient-to-b max-md:w-screen from-gray-50 to-gray-100 min-h-screen font-mitra">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">مدیریت پرداخت‌ها</h2>
      {loading ? (
        <div className="flex  justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4  border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg">{error}</p>
      ) : registrations.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ ثبت‌نامی یافت نشد.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByBatch).map(([batchTitle, regs]) => (
            <motion.div
              key={batchTitle}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="border border-gray-200   rounded-2xl max-md:ml-4 shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleBatch(batchTitle)}
                className="w-full text-right px-6 py-4 font-semibold text-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-t-2xl focus:outline-none transition-all duration-300 flex justify-between items-center"
              >
                <span>{batchTitle}</span>
                <motion.span
                  animate={{ rotate: expandedBatches[batchTitle] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-indigo-600"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {expandedBatches[batchTitle] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
                    className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-6 p-6"
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
                          className="relative border border-gray-200 rounded-xl shadow-md hover:shadow-xl  transition-all duration-300 bg-white cursor-pointer"
                          style={{ height: "320px", perspective: "1200px" }}
                          onClick={() => toggleFlipCard(reg.id)}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
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
                            {/* Front Side */}
                            <div
                              className="absolute w-full h-full p-5 overflow-y-auto bg-white rounded-xl"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                                {child ? child.full_name : "نامشخص"}
                              </h3>
                              {batch ? (
                                <div className="space-y-2 text-xl">
                                  <p className="text-gray-700 flex items-center">
                                    <span className="inline-block w-20 font-medium">برنامه:</span>
                                    <span className="text-gray-600">{batch.schedule || "-"}</span>
                                  </p>
                                  <p className="text-gray-700  flex items-center">
                                    <span className="inline-block w-20 font-medium">ظرفیت:</span>
                                    <span className="text-gray-600">{batch.capacity}</span>
                                  </p>
                                  <p className="text-gray-700  flex items-center">
                                    <span className="inline-block w-20 font-medium">وضعیت:</span>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        reg.payment_status === "paid"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {reg.payment_status}
                                    </span>
                                  </p>
                                  <p className="text-gray-700 flex items-center">
                                    <span className="inline-block w-20 font-medium">مبلغ:</span>
                                    <span className="text-gray-600">{reg.final_price}</span>
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-600 text-sm">بچ نامشخص</p>
                              )}
                            </div>

                            {/* Back Side */}
                            <div
                              className="absolute w-full h-full p-5 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-y-auto"
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                              {regDetails ? (
                                <>
                                  {reg.payment_method !== "installment" ? (
                                    <div className="space-y-4">
                                      <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                                        رسید پرداخت
                                      </h3>
                                      {getReceiptImageAdmin(reg.id) ? (
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setModalImage(getReceiptImageAdmin(reg.id));
                                          }}
                                          className="px-5 py-2 rounded-lg text-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
                                        >
                                          مشاهده رسید
                                        </motion.button>
                                      ) : (
                                        <p className="text-gray-500 text-sm">رسید موجود نیست</p>
                                      )}
                                      {
                                        reg.payment_status !== "paid" && (
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          disabled={confirmedPaymentIds.has(reg.id) || confirmingPaymentIds.has(reg.id)}
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await handleConfirmPayment(reg.id);
                                          }}
                                          className={`px-5 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
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
                                    </div>
                                  ) : (
                                    <>
                                      <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                                        جزئیات قسط
                                      </h3>
                                      <ul className="space-y-4">
                                        {regDetails.installments.map((inst) => (
                                          <li
                                            key={inst.id}
                                            className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm"
                                          >
                                            <div className="space-y-2 text-xl">
                                              <p className="flex items-center">
                                                <span className="inline-block w-24 font-medium">مبلغ:</span>
                                                <span>{inst.amount}</span>
                                              </p>
                                              <p className="flex items-center">
                                                <span className="inline-block w-24 font-medium">وضعیت:</span>
                                                <span
                                                  className={`px-2 py-1 rounded-full text-xs ${
                                                    inst.status === "paid"
                                                      ? "bg-green-100 text-green-700"
                                                      : "bg-yellow-100 text-yellow-700"
                                                  }`}
                                                >
                                                  {inst.status}
                                                </span>
                                              </p>
                                              <p className="flex items-center">
                                                <span className="inline-block w-24 font-medium">سررسید:</span>
                                                <span>{convertToJalali(inst.due_date)}</span>
                                              </p>
                                            </div>
                                            {inst.secure_url && (
                                              <div className="flex items-center space-x-4  mt-6">
                                                <motion.button
                                                  whileHover={{ scale: 1.05 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalImage(getInstallmentReceiptImageAdmin(inst.id));
                                                  }}
                                                  className="px-3 py-2 rounded-lg  bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 text-lg font-medium"
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
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={modalImage} alt="Receipt Large" className="max-w-full max-h-[80vh] rounded-lg" />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
              >
                <IoClose size={24} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentsTab;