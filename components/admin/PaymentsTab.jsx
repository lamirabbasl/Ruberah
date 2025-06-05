"use client";
import React, { useState, useEffect } from "react";

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
  const [modalImage, setModalImage] = useState(null); // State for modal image
  const [confirmingPaymentIds, setConfirmingPaymentIds] = useState(new Set()); // Track confirming payments
  const [confirmedPaymentIds, setConfirmedPaymentIds] = useState(new Set()); // Track confirmed payments

  // Fetch registrations and batches on mount
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

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (registrations.length === 0) return <p>هیچ ثبت‌نامی یافت نشد.</p>;

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

        // Store installments array directly in regDetails.installments
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
    if (confirmingPaymentIds.has(regId)) return; // Prevent duplicate clicks
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

  return (
    <div className="p-4 ">
      <h2 className="text-xl font-bold mb-4">پرداخت‌ها</h2>
      <div>
        {Object.entries(groupedByBatch).map(([batchTitle, regs]) => (
          <div key={batchTitle} className="mb-4 border rounded bg-white shadow">
            <button
              onClick={() => toggleBatch(batchTitle)}
              className="w-full text-right px-4 py-2 font-semibold text-lg bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              {batchTitle}
            </button>
            {expandedBatches[batchTitle] && (
              <div className="grid grid-cols-3 gap-4 p-4">
                {regs.map((reg) => {
                  const child = childrenMap[reg.child];
                  const batch = batches.find((b) => b.id === reg.batch);
                  const isFlipped = flippedCards[reg.id];
                  const regDetails = registrationDetailsMap[reg.id];

                  return (
                    <div
                      key={reg.id}
                      className={`border rounded shadow hover:shadow-lg transition bg-white perspective ${
                        isFlipped ? "is-flipped" : ""
                      }`}
                      style={{ cursor: "pointer", perspective: "1000px", height: "300px" }}
                      onClick={() => toggleFlipCard(reg.id)}
                    >
                      <div
                        className="relative w-full h-full duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transition: "transform 0.7s",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                          height: "100%",
                          position: "relative",
                        }}
                      >
                        {/* Front Side */}
                        <div
                          className="absolute w-full h-full"
                          style={{
                            backfaceVisibility: "hidden",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            padding: "1rem",
                            boxSizing: "border-box",
                            overflowY: "auto",
                            height: "100%",
                          }}
                        >
                          <h3 className="text-lg font-semibold mb-2">
                            {child ? child.full_name : "نامشخص"}
                          </h3>
                          {batch ? (
                            <>
                              <p className="text-gray-700">برنامه: {batch.schedule}</p>
                              <p className="text-gray-700">ظرفیت: {batch.capacity}</p>
                            </>
                          ) : (
                            <p className="text-gray-700">بچه نامشخص</p>
                          )}
                          <p className="text-gray-700 mt-2">
                            وضعیت پرداخت: {reg.payment_status}
                          </p>
                          <p className="text-gray-700">مبلغ نهایی: {reg.final_price}</p>
                        </div>

                          {/* Back Side */}
                          <div
                            className="absolute w-full h-full backface-hidden bg-gray-100 p-4 overflow-y-auto max-h-[280px]"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                            }}
                          >
                            {regDetails ? (
                              <>
{reg.payment_method !== "installment" ? (
  <>
    <h3 className="text-lg font-semibold mb-2">رسید پرداخت</h3>
    <div className="flex flex-col items-start space-y-4">
      {getReceiptImageAdmin(reg.id) ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setModalImage(getReceiptImageAdmin(reg.id));
          }}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          مشاهده رسید
        </button>
      ) : (
        <p className="text-gray-500">رسید موجود نیست</p>
      )}
{reg.payment_status !== "paid" && (
  <button
    disabled={confirmedPaymentIds.has(reg.id) || confirmingPaymentIds.has(reg.id)}
    onClick={async (e) => {
      e.stopPropagation();
      await handleConfirmPayment(reg.id);
    }}
    className={`px-3 py-1 rounded text-white ${
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
  </button>
)}
    </div>
  </>
) : (
                                  <>
                                    <h3 className="text-lg font-semibold mb-2">جزئیات ثبت‌نام</h3>
                                    <ul>
                                      {regDetails.installments.map((inst) => (
                                        <li key={inst.id} className="mb-2">
                                          <p>مبلغ: {inst.amount}</p>
                                          <p>وضعیت: {inst.status}</p>
                                          <p>تاریخ سررسید: {inst.due_date}</p>
                                          {inst.secure_url ? (
                                            <div className="flex items-center space-x-4">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setModalImage(
                                                    getInstallmentReceiptImageAdmin(inst.id)
                                                  );
                                                }}
                                                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                                              >
                                                مشاهده رسید
                                              </button>
                                              <button
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
                                                className={`px-3 py-1 rounded text-white ${
                                                  inst.status === "paid"
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-700"
                                                }`}
                                              >
                                                تایید پرداخت
                                              </button>
                                            </div>
                                          ) : null}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </>
                            ) : (
                              <p>در حال بارگذاری جزئیات...</p>
                            )}
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for showing large receipt image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-5xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="Receipt Large"
              className="max-w-full max-h-[90vh]"
            />
            <button
              onClick={() => setModalImage(null)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;
