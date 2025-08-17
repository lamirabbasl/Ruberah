"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoChevronBackOutline } from "react-icons/io5";
import {
  getRegistrationsAdmin,
  getChildByIdAdmin,
  getBatches,
  getRegistrationDetailsById,
  getInstallmentDetailsRegistrationId,
  getInstallmentReceiptImageAdmin,
  approveInstallmentPayment,
  getReceiptImageAdmin,
  approveReceiptPayment,
  rejectInstallment,
  rejectReceipt,
  rejectUserSignup,
} from "@/lib/api/api";
import { useRouter, useSearchParams } from "next/navigation";
import BatchSection from "@/components/admin/payments/BatchSection";
import PaginationControls from "@/components/admin/payments/PaginationControls";
import ImageModal from "@/components/admin/payments/ImageModal";

const PaymentsTab = ({ batchId = null }) => {
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
  const [receiptImages, setReceiptImages] = useState({});
  const [installmentReceiptImages, setInstallmentReceiptImages] = useState({});
  const [fetchedImages, setFetchedImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState("all");

  // New states for rejects
  const [rejectingReceiptIds, setRejectingReceiptIds] = useState(new Set());
  const [rejectedReceiptIds, setRejectedReceiptIds] = useState(new Set());
  const [rejectingInstallmentIds, setRejectingInstallmentIds] = useState(new Set());
  const [rejectedInstallmentIds, setRejectedInstallmentIds] = useState(new Set());
  const [rejectingSignupIds, setRejectingSignupIds] = useState(new Set());
  const [rejectedSignupIds, setRejectedSignupIds] = useState(new Set());

  // Confirm modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search state from URL
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    setSearch(searchQuery);
  }, [searchParams]);

  // Initial data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRegistrationsAdmin(
          currentPage,
          search,
          batchId,
          selectedPaymentStatus !== "all" ? selectedPaymentStatus : "",
          selectedApprovalStatus !== "all" ? selectedApprovalStatus : ""
        );
        console.log("API Response:", response);

        let regs = [];
        let is_last_page = true;

        if (response && Array.isArray(response.results)) {
          regs = response.results;
          is_last_page = response.is_last_page || false;
        } else if (response && response.id) {
          regs = [response];
          is_last_page = true;
        } else {
          throw new Error("Invalid API response: neither a list nor a single registration");
        }

        setRegistrations(regs);
        setIsLastPage(is_last_page);

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
        console.error("Fetch error:", err);
        setError("خطا در دریافت اطلاعات پرداخت‌ها: " + err.message);
        setRegistrations([]);
        setIsLastPage(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      Object.values(receiptImages).forEach((url) => {
        if (url)
          URL.revokeObjectURL(url);
      });
      Object.values(installmentReceiptImages).forEach((url) => {
        if (url)
          URL.revokeObjectURL(url);
      });
    };
  }, [currentPage, search, batchId, selectedPaymentStatus, selectedApprovalStatus]);

  // Fetch receipt images for non-installment payments
  useEffect(() => {
    async function fetchReceiptImages() {
      const hasExpandedBatches = Object.values(expandedBatches).some(
        (isExpanded) => isExpanded
      );
      if (!hasExpandedBatches || registrations.length === 0) return;

      const receiptImagePromises = registrations
        .filter(
          (reg) =>
            reg.payment_method !== "installment" &&
            !fetchedImages[`reg-${reg.id}`]
        )
        .map(async (reg) => {
          try {
            const receiptUrl = await getReceiptImageAdmin(reg.id);
            setFetchedImages((prev) => ({ ...prev, [`reg-${reg.id}`]: true }));
            return { id: reg.id, url: receiptUrl };
          } catch (err) {
            setFetchedImages((prev) => ({ ...prev, [`reg-${reg.id}`]: true }));
            return { id: reg.id };
          }
        });

      const receiptImagesData = await Promise.all(receiptImagePromises);
      setReceiptImages((prev) => ({
        ...prev,
        ...receiptImagesData.reduce((acc, { id, url }) => {
          acc[id] = url;
          return acc;
        }, {}),
      }));
    }

    fetchReceiptImages();
  }, [expandedBatches, registrations]);

  // Fetch installment receipt images
  useEffect(() => {
    async function fetchInstallmentReceiptImages() {
      const flippedRegIds = Object.keys(flippedCards).filter(
        (id) => flippedCards[id]
      );
      if (flippedRegIds.length === 0) return;

      const updatedDetailsMap = { ...registrationDetailsMap };
      await Promise.all(
        flippedRegIds.map(async (regId) => {
          if (!updatedDetailsMap[regId]) {
            try {
              const regDetails = await getRegistrationDetailsById(regId);
              const installmentDetails = await getInstallmentDetailsRegistrationId(
                regId
              );
              const installmentsWithImages = await Promise.all(
                installmentDetails.map(async (inst) => {
                  if (inst.secure_url && !fetchedImages[`installment-${inst.id}`]) {
                    try {
                      const receiptUrl = await getInstallmentReceiptImageAdmin(
                        inst.id
                      );
                      setFetchedImages((prev) => ({
                        ...prev,
                        [`installment-${inst.id}`]: true,
                      }));
                      setInstallmentReceiptImages((prev) => ({
                        ...prev,
                        [inst.id]: receiptUrl,
                      }));
                      return { ...inst, receiptUrl };
                    } catch (err) {
                      setFetchedImages((prev) => ({
                        ...prev,
                        [`installment-${inst.id}`]: true,
                      }));
                      return { ...inst };
                    }
                  }
                  return { ...inst, receiptUrl: installmentReceiptImages[inst.id] || null };
                })
              );
              updatedDetailsMap[regId] = {
                ...regDetails,
                installments: installmentsWithImages,
              };
            } catch (error) {
              console.error("Error fetching registration details or installments", error);
            }
          }
        })
      );
      setRegistrationDetailsMap(updatedDetailsMap);
    }

    if (Object.values(flippedCards).some((isFlipped) => isFlipped)) {
      fetchInstallmentReceiptImages();
    }
  }, [flippedCards, fetchedImages]);

  const groupedByBatch = {};
  registrations.forEach((reg) => {
    const batch = batches.find((b) => b.id === (reg.batch?.id || reg.batch));
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
    setFlippedCards((prev) => ({ ...prev, [regId]: !prev[regId] }));
  };

  const handleConfirmPayment = async (regId) => {
    if (confirmingPaymentIds.has(regId)) return;
    setConfirmingPaymentIds((prev) => new Set(prev).add(regId));
    try {
      await approveReceiptPayment(regId);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, payment_status: "paid" } : r))
      );
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

  const handleApproveInstallmentPayment = async (instId, regId) => {
    try {
      await approveInstallmentPayment(instId);
      alert("قسط با موفقیت تایید شد");
      setRegistrationDetailsMap((prev) => {
        const updated = { ...prev };
        const regDetails = updated[regId];
        if (regDetails) {
          const instIndex = regDetails.installments.findIndex(
            (i) => i.id === instId
          );
          if (instIndex !== -1) {
            regDetails.installments[instIndex].status = "paid";
          }
        }
        return updated;
      });
    } catch (error) {
      console.error("Error approving installment payment:", error);
      alert("خطا در تایید قسط");
    }
  };

  // New reject handlers
  const handleRejectReceipt = async (regId) => {
    if (rejectingReceiptIds.has(regId)) return;
    setRejectingReceiptIds((prev) => new Set(prev).add(regId));
    try {
      await rejectReceipt(regId);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, payment_status: "rejected" } : r))
      );
      setRejectedReceiptIds((prev) => new Set(prev).add(regId));
      alert("پرداخت رد شد");
    } catch (error) {
      console.error("Error rejecting receipt:", error);
      alert("خطا در رد پرداخت");
    } finally {
      setRejectingReceiptIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(regId);
        return newSet;
      });
    }
  };

  const handleRejectInstallment = async (instId, regId) => {
    if (rejectingInstallmentIds.has(instId)) return;
    setRejectingInstallmentIds((prev) => new Set(prev).add(instId));
    try {
      await rejectInstallment(instId);
      setRegistrationDetailsMap((prev) => {
        const updated = { ...prev };
        const regDetails = updated[regId];
        if (regDetails) {
          const instIndex = regDetails.installments.findIndex(
            (i) => i.id === instId
          );
          if (instIndex !== -1) {
            regDetails.installments[instIndex].status = "rejected";
          }
        }
        return updated;
      });
      setRejectedInstallmentIds((prev) => new Set(prev).add(instId));
      alert("قسط رد شد");
    } catch (error) {
      console.error("Error rejecting installment:", error);
      alert("خطا در رد قسط");
    } finally {
      setRejectingInstallmentIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(instId);
        return newSet;
      });
    }
  };

  const handleRejectSignup = async (regId) => {
    if (rejectingSignupIds.has(regId)) return;
    setRejectingSignupIds((prev) => new Set(prev).add(regId));
    try {
      await rejectUserSignup(regId);
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
      setRejectedSignupIds((prev) => new Set(prev).add(regId));
      alert("ثبت نام رد شد");
    } catch (error) {
      console.error("Error rejecting signup:", error);
      alert("خطا در رد ثبت نام");
    } finally {
      setRejectingSignupIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(regId);
        return newSet;
      });
    }
  };

  // Request confirm functions
  const requestRejectReceipt = (regId) => {
    setConfirmTitle("رد پرداخت");
    setConfirmAction(() => () => handleRejectReceipt(regId));
    setShowConfirmModal(true);
  };

  const requestRejectInstallment = (instId, regId) => {
    setConfirmTitle("رد قسط");
    setConfirmAction(() => () => handleRejectInstallment(instId, regId));
    setShowConfirmModal(true);
  };

  const requestRejectSignup = (regId) => {
    setConfirmTitle("رد ثبت نام");
    setConfirmAction(() => () => handleRejectSignup(regId));
    setShowConfirmModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && !(newPage > currentPage && isLastPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  return (
    <div className="p-6 bg-gradient-to-b w-5/6 max-md:w-screen text-black max-md:w-screen from-gray-50 to-gray-100 min-h-screen font-mitra dir-rtl text-right">
      <button
        onClick={() => router.push("/admin/dashboard/payments")}
        className="left-6 flex justify-center items-center absolute px-4 py-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition rounded-lg text-lg font-medium"
      >
        <IoChevronBackOutline />
        <span> بازگشت</span>
      </button>
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        مدیریت پرداخت‌ها
      </h2>
      <div className="mb-6 flex flex-row-reverse gap-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="جستجوی نام..."
          className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-right text-lg"
        />
        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-right text-lg"
        >
          <option value="all">همه وضعیت پرداخت</option>
          <option value="unpaid">پرداخت نشده</option>
          <option value="partial">پرداخت جزئی</option>
          <option value="paid">پرداخت شده</option>
        </select>
        <select
          value={selectedApprovalStatus}
          onChange={(e) => setSelectedApprovalStatus(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-right text-lg"
        >
          <option value="all">همه وضعیت تایید</option>
          <option value="pending">در انتظار</option>
          <option value="approved">تایید شده</option>
          <option value="rejected">رد شده</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg">
          {error}
        </p>
      ) : registrations.length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">
          هیچ ثبت‌نامی یافت نشد.
        </p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByBatch).map(([batchTitle, regs]) => (
            <BatchSection
              key={batchTitle}
              batchTitle={batchTitle}
              regs={regs}
              expandedBatches={expandedBatches}
              toggleBatch={toggleBatch}
              childrenMap={childrenMap}
              batches={batches}
              flippedCards={flippedCards}
              toggleFlipCard={toggleFlipCard}
              registrationDetailsMap={registrationDetailsMap}
              receiptImages={receiptImages}
              confirmingPaymentIds={confirmingPaymentIds}
              confirmedPaymentIds={confirmedPaymentIds}
              handleConfirmPayment={handleConfirmPayment}
              installmentReceiptImages={installmentReceiptImages}
              handleApproveInstallmentPayment={handleApproveInstallmentPayment}
              setModalImage={setModalImage}
              // New props for rejects
              rejectingReceiptIds={rejectingReceiptIds}
              rejectedReceiptIds={rejectedReceiptIds}
              rejectingInstallmentIds={rejectingInstallmentIds}
              rejectedInstallmentIds={rejectedInstallmentIds}
              rejectingSignupIds={rejectingSignupIds}
              rejectedSignupIds={rejectedSignupIds}
              requestRejectReceipt={requestRejectReceipt}
              requestRejectInstallment={requestRejectInstallment}
              requestRejectSignup={requestRejectSignup}
            />
          ))}
          <PaginationControls
            currentPage={currentPage}
            isLastPage={isLastPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
      <ImageModal modalImage={modalImage} setModalImage={setModalImage} />
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 dir-rtl">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">{confirmTitle}</h2>
            <p className="mb-6 text-gray-700">آیا مطمئن هستید که می‌خواهید این عملیات را انجام دهید؟</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                لغو
              </button>
              <button
                onClick={async () => {
                  if (confirmAction) await confirmAction();
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                تایید
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;