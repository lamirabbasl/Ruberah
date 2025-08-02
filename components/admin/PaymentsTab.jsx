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
  confirmPaymentNonInstallment,
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
        const response = await getRegistrationsAdmin(currentPage, search, batchId);
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
        if (url )
          URL.revokeObjectURL(url);
      });
      Object.values(installmentReceiptImages).forEach((url) => {
        if (url )
          URL.revokeObjectURL(url);
      });
    };
  }, [currentPage, search, batchId]);

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
                      return { ...inst};
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
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="جستجوی نام..."
          className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-right text-lg"
        />
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
    </div>
  );
};

export default PaymentsTab;