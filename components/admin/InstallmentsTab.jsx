"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">ایجاد اقساط</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          افزودن قسط
        </motion.button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان قسط"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
      </div>

      <AnimatePresence>
        {showAddForm && (
          <AddInstallmentCard
            onClose={() => setShowAddForm(false)}
            onAdded={() => {
              setShowAddForm(false);
              fetchData();
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm relative"
            >
              <button
                onClick={cancelDelete}
                className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 transition"
                aria-label="بستن تایید حذف"
              >
                <IoClose size={24} />
              </button>
              <p className="mb-6 text-red-600 font-semibold text-center">
                آیا از حذف قسط "{installmentToDelete?.title}" مطمئن هستید؟
              </p>
              {deleteError && (
                <p className="mb-4 text-red-500 text-sm">{deleteError}</p>
              )}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteInstallment}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-center text-gray-600">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : Object.keys(filteredInstallmentsByBatch).length === 0 ? (
        <p className="text-center text-gray-600">هیچ اقساطی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {Object.entries(filteredInstallmentsByBatch).map(([batchId, insts]) => (
              <motion.div
                key={batchId}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {getBatchName(Number(batchId))}
                </h3>
                {insts.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex justify-between items-center border-b last:border-b-0 py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-700">{inst.title}</p>
                      <p className="text-sm text-gray-600">
                        مبلغ: {inst.amount} - ماه سررسید: {inst.deadline_month}
                      </p>
                    </div>
                    <button
                      onClick={() => confirmDeleteInstallment(inst)}
                      className="text-red-500 hover:text-red-700 transition"
                      aria-label={`حذف قسط ${inst.title}`}
                    >
                      <IoClose size={20} />
                    </button>
                  </div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default InstallmentsTab;