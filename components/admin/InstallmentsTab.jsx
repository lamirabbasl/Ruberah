"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { getInstallmentTemplates, getBatches, deleteInstallmentTemplate } from "@/lib/api/api";
import AddInstallmentCard from "./AddInstallmentCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { convertToJalali } from "@/lib/utils/convertDate";

const InstallmentsTab = () => {
  const [installments, setInstallments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [installmentData, batchData] = await Promise.all([
        getInstallmentTemplates(),
        getBatches(),
      ]);
      setInstallments(installmentData);
      setBatches(batchData);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در بارگذاری داده‌ها";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const installmentsByBatch = installments.reduce((acc, installment) => {
    if (!acc[installment.batch]) acc[installment.batch] = [];
    acc[installment.batch].push(installment);
    return acc;
  }, {});

  const getBatchName = (batchId) => {
    const batch = batches.find((b) => b.id === batchId);
    return batch ? batch.title || batch.name : `بچۀ نامشخص (${batchId})`;
  };

  const confirmDeleteInstallment = (installment) => {
    setInstallmentToDelete(installment);
    setShowDeleteConfirm(true);
  };

  const handleDeleteInstallment = async () => {
    if (!installmentToDelete) return;
    try {
      setLoading(true);
      await deleteInstallmentTemplate(installmentToDelete.id);
      toast.success("قسط با موفقیت حذف شد");
      setShowDeleteConfirm(false);
      setInstallmentToDelete(null);
      await fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در حذف قسط";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setInstallmentToDelete(null);
  };

  const filteredInstallmentsByBatch = {};
  Object.entries(installmentsByBatch).forEach(([batchId, insts]) => {
    const batchName = getBatchName(Number(batchId));
    if (batchName.toLowerCase().includes(searchTerm.toLowerCase())) {
      filteredInstallmentsByBatch[batchId] = insts;
    }
  });

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">مدیریت اقساط</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 text-sm font-medium"
        >
          افزودن قسط جدید
        </motion.button>
      </div>

      <input
        type="text"
        placeholder="جستجو بر اساس عنوان بچ"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm mb-6"
      />

      <AnimatePresence>
        {showAddForm && (
          <AddInstallmentCard
            onClose={() => setShowAddForm(false)}
            onAdded={() => {
              toast.success("قسط جدید با موفقیت اضافه شد");
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
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <p className="mb-6 text-red-600 font-semibold text-center text-lg">
                آیا از حذف قسط "{installmentToDelete?.title}" مطمئن هستید؟
              </p>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-5 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 text-sm"
                >
                  لغو
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteInstallment}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
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
      ) : Object.keys(filteredInstallmentsByBatch).length === 0 ? (
        <p className="text-center text-gray-600 bg-white p-4 rounded-lg shadow">هیچ اقساطی یافت نشد.</p>
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
                className="bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{getBatchName(Number(batchId))}</h3>
                {insts.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex justify-between items-center bg-white rounded-lg px-4 py-3 mb-2 shadow"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{inst.title}</p>
                      <p className="text-sm text-gray-600">مبلغ: {inst.amount}</p>
                      <p className="text-sm text-gray-600">تاریخ سررسید: {convertToJalali(inst.due_date)}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => confirmDeleteInstallment(inst)}
                      className="text-red-500 hover:text-red-700"
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

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        rtl={true}
      />
    </div>
  );
};

export default InstallmentsTab;