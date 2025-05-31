"use client";
import React, { useState, useEffect } from "react";
import {
  getRegistrations,
  getChildById,
  getBatchById,
  getSeasons,
  uploadInstallmentPayment,
} from "@/lib/api/api";

function CoursesPage() {
  const [registrations, setRegistrations] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [batchesMap, setBatchesMap] = useState({});
  const [seasons, setSeasons] = useState([]);
  const [expandedChildId, setExpandedChildId] = useState(null);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [uploadingInstallmentId, setUploadingInstallmentId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const regs = await getRegistrations();
        setRegistrations(regs);

        const seasonData = await getSeasons();
        setSeasons(seasonData);

        // Fetch children info for each registration
        const childrenIds = [...new Set(regs.map((r) => r.child))];
        const childrenData = {};
        for (const childId of childrenIds) {
          const child = await getChildById(childId);
          childrenData[childId] = child;
        }
        setChildrenMap(childrenData);

        // Fetch batch info for each registration batch id
        const batchIds = [...new Set(regs.map((r) => r.batch))];
        const batchesData = {};
        for (const batchId of batchIds) {
          const batch = await getBatchById(batchId);
          batchesData[batchId] = batch;
        }
        setBatchesMap(batchesData);
      } catch (error) {
        console.error("Error fetching registrations or related data:", error);
      }
    }
    fetchData();
  }, []);

  const getSeasonById = (seasonId) => {
    return seasons.find((season) => season.id === seasonId);
  };

  const handleToggleChild = (childId) => {
    setExpandedChildId(expandedChildId === childId ? null : childId);
    setExpandedBatchId(null); // close batch info when switching child
  };

  const handleToggleBatch = (batchId) => {
    setExpandedBatchId(expandedBatchId === batchId ? null : batchId);
  };

  const handleUploadInstallment = async (installmentId) => {
    setUploadingInstallmentId(installmentId);
    try {
      // For now, no file upload, just simulate API call
      await uploadInstallmentPayment(installmentId);
      alert("پرداخت اقساطی با موفقیت ثبت شد.");
    } catch (error) {
      alert("خطا در ثبت پرداخت اقساطی.");
    } finally {
      setUploadingInstallmentId(null);
    }
  };

  // Group registrations by child
  const registrationsByChild = registrations.reduce((acc, reg) => {
    if (!acc[reg.child]) acc[reg.child] = [];
    acc[reg.child].push(reg);
    return acc;
  }, {});

  return (
    <div dir="rtl" className="p-6 w-1/2 mx-auto mt-18  font-mitra text-black">
      <h1 className="text-3xl text-center  font-bold mb-10 text-gray-900">
        دوره‌های ثبت‌نام شده
      </h1>
      {Object.entries(registrationsByChild).map(([childId, regs]) => {
        const child = childrenMap[childId];
        return (
          <div
            key={childId}
            className="mb-6 border  border-gray-300 rounded-lg p-4"
          >
            <div
              className="cursor-pointer font-semibold text-lg mb-2"
              onClick={() => handleToggleChild(childId)}
            >
              {child ? child.full_name : "در حال بارگذاری..."}
            </div>
            {expandedChildId === childId && (
              <div className="space-y-4">
                {regs.map((reg) => {
                  const batch = batchesMap[reg.batch];
                  const season = batch ? getSeasonById(batch.season) : null;
                  const isBatchExpanded = expandedBatchId === reg.batch;
                  return (
                    <div
                      key={reg.id}
                      className="border border-gray-200 rounded p-3"
                    >
                      <div className="flex gap-20">
                        <div
                          className="cursor-pointer font-medium"
                          onClick={() => handleToggleBatch(reg.batch)}
                        >
                          {batch ? batch.title : "در حال بارگذاری..."}{" "}
                          {season ? `(${season.name})` : ""}
                        </div>
                        <p>شروع: {batch?.start_date || "نامشخص"}</p>
                        <p>پایان: {batch?.end_date || "نامشخص"}</p>
                      </div>
                      {isBatchExpanded && (
                        <div className="mt-2 text-right space-y-2">
                          <p>روش پرداخت: {reg.payment_method}</p>
                          <p>وضعیت: {reg.status}</p>
                          {(reg.status === "paid" ||
                            reg.status === "pending") && (
                            <>
                              <p>
                                تاریخ آپلود رسید:{" "}
                                {reg.receipt_uploaded_at || "ندارد"}
                              </p>
                              <p>قیمت نهایی: {reg.final_price} تومان</p>
                            </>
                          )}
                          {reg.status === "pending" && (
                            <button
                              className="mt-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                              onClick={() => alert("آپلود رسید پرداخت")}
                            >
                              آپلود رسید پرداخت
                            </button>
                          )}
                          {reg.status !== "paid" &&
                            reg.status !== "pending" && (
                              <>
                                {batch &&
                                batch.allow_installment &&
                                batch.installment_templates.length > 0 ? (
                                  <div>
                                    <p className="font-semibold mb-2">
                                      پرداخت اقساطی:
                                    </p>
                                    {batch.installment_templates.map((inst) => (
                                      <div
                                        key={inst.id}
                                        className="flex items-center justify-between mb-2"
                                      >
                                        <p>
                                          {inst.title} - مبلغ: {inst.amount}{" "}
                                          تومان - مهلت: {inst.deadline_month}{" "}
                                          ماه
                                        </p>
                                        <button
                                          disabled={
                                            uploadingInstallmentId === inst.id
                                          }
                                          onClick={() =>
                                            handleUploadInstallment(inst.id)
                                          }
                                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                                        >
                                          {uploadingInstallmentId === inst.id
                                            ? "در حال ارسال..."
                                            : "پرداخت"}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <button
                                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                                    onClick={() => alert("آپلود رسید پرداخت")}
                                  >
                                    آپلود رسید
                                  </button>
                                )}
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CoursesPage;
