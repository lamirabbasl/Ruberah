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
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen  font-mitra">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">مدیریت اقساط</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          افزودن قسط جدید
        </motion.button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="جستجو بر اساس عنوان بچ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 text-sm"
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
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
            >
       
              <p className="mb-6 text-red-600 font-semibold text-center text-lg">
                آیا از حذف قسط "{installmentToDelete?.title}" مطمئن هستید؟
              </p>
              {deleteError && (
                <p className="mb-4 text-red-500 text-sm bg-red-50 p-3 rounded-lg">{deleteError}</p>
              )}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteInstallment}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 text-sm font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg">{error}</p>
      ) : Object.keys(filteredInstallmentsByBatch).length === 0 ? (
        <p className="text-center text-gray-600 font-medium bg-white p-4 rounded-lg shadow">هیچ اقساطی یافت نشد.</p>
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
                className="relative bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
                  {getBatchName(Number(batchId))}
                </h3>
                {insts.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex justify-between items-center last:border-b-0 py-3 bg-white rounded-lg px-4 mb-2 shadow-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800 text-sm">{inst.title}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <span className="inline-block w-24 font-medium">مبلغ:</span>
                          <span>{inst.amount}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="inline-block w-24 font-medium">ماه سررسید:</span>
                          <span>{inst.deadline_month}</span>
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => confirmDeleteInstallment(inst)}
                      className="text-red-500 hover:text-red-700 transition-all duration-200"
                      aria-label={`حذف قسط ${inst.title}`}
                    >
                      <IoClose size={20} />
                    </motion.button>
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