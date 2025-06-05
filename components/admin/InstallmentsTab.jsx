"use client";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getInstallmentTemplates, getBatches } from "@/lib/api/api";
import AddInstallmentCard from "./AddInstallmentCard";

const InstallmentsTab = () => {
  const [installments, setInstallments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [installmentData, batchData] = await Promise.all([
        getInstallmentTemplates(),
        getBatches(),
      ]);
      setInstallments(installmentData);
      setBatches(batchData);
      setLoading(false);
    } catch (err) {
      setError("خطا در بارگذاری داده‌ها");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group installments by batch id
  const installmentsByBatch = installments.reduce((acc, installment) => {
    if (!acc[installment.batch]) {
      acc[installment.batch] = [];
    }
    acc[installment.batch].push(installment);
    return acc;
  }, {});

  // Helper to get batch name by id
  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b.id === batchId);
    return batch ? batch.title || batch.name : `بچۀ نامشخص (${batchId})`;
  };

  const confirmDeleteInstallment = (installment) => {
    setInstallmentToDelete(installment);
    setShowDeleteConfirm(true);
    setDeleteError(null);
  };

  const handleDeleteInstallment = async () => {
    if (!installmentToDelete) return;
    try {
      setLoading(true);
      await deleteInstallmentTemplate(installmentToDelete.id);
      setShowDeleteConfirm(false);
      setInstallmentToDelete(null);
      setDeleteError(null);
      await fetchData();
      setLoading(false);
    } catch (err) {
      setDeleteError("خطا در حذف قسط");
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInstallmentToDelete(null);
    setDeleteError(null);
  };

  // Filter installments by batch name search term
  const filteredInstallmentsByBatch = {};
  Object.entries(installmentsByBatch).forEach(([batchId, insts]) => {
    const batchName = getBatchName(Number(batchId));
    if (batchName.toLowerCase().includes(searchTerm.toLowerCase())) {
      filteredInstallmentsByBatch[batchId] = insts;
    }
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">ایجاد اقساط</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          افزودن قسط
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان قسط"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {showAddForm && (
        <AddInstallmentCard
          onClose={() => setShowAddForm(false)}
          onAdded={() => {
            setShowAddForm(false);
            fetchData();
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <button
              onClick={cancelDelete}
              className="absolute top-2 left-2 text-gray-600 hover:text-gray-900"
              aria-label="بستن تایید حذف"
            >
              <IoClose size={24} />
            </button>
            <p className="mb-4 text-red-600 font-semibold">
              آیا از حذف قسط "{installmentToDelete?.title}" مطمئن هستید؟
            </p>
            {deleteError && (
              <p className="mb-4 text-red-600 font-semibold">{deleteError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
              >
                لغو
              </button>
              <button
                onClick={handleDeleteInstallment}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : Object.keys(filteredInstallmentsByBatch).length === 0 ? (
        <p>هیچ اقساطی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
          {Object.entries(filteredInstallmentsByBatch).map(([batchId, insts]) => (
            <div
              key={batchId}
              className="relative border rounded p-4 shadow hover:shadow-lg transition bg-white"
            >
              <h3 className="text-lg font-semibold mb-2">{getBatchName(Number(batchId))}</h3>
              {insts.map((inst) => (
                <div
                  key={inst.id}
                  className="flex justify-between items-center border-b last:border-b-0 py-2"
                >
                  <div>
                    <p className="font-semibold">{inst.title}</p>
                    <p className="text-sm text-gray-600">
                      مبلغ: {inst.amount} - ماه سررسید: {inst.deadline_month}
                    </p>
                  </div>
                  <button
                    onClick={() => confirmDeleteInstallment(inst)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`حذف قسط ${inst.title}`}
                  >
                    <IoClose size={20} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstallmentsTab;
