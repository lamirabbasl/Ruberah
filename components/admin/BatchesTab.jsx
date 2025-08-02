"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getBatches,
  addBatch,
  editBatch,
  deleteBatch,
  getCourses,
  getSeasons,
  searchBatches,
} from "@/lib/api/api";
import BatchCard from "./batches/BatchCard";
import BatchForm from "./batches/BatchForm";
import BatchModal from "./batches/BatchModal";
import BatchSearch from "./batches/BatchSearch";
import BatchList from "./batches/BatchList";
import BatchHeader from "./batches/BatchHeader";
import DeleteConfirmModal from "./batches/DeleteConfirmModal";
import { validateBatch } from "./batches/BatchValidation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BatchesTab = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newBatch, setNewBatch] = useState({
    course: "",
    season: "",
    title: "",
    min_age: "",
    max_age: "",
    schedule: "",
    location: "",
    capacity: "",
    allow_gateway: false,
    allow_receipt: false,
    allow_installment: false,
    price_gateway: "",
    price_receipt: "",
    price_installment: "",
    installment_count: 0,
    colleague_discount_percent: 0,
    loyalty_discount_percent: 0,
  });
  const [editingBatch, setEditingBatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const fetchBatches = useCallback(async (term = "") => {
    setLoading(true);
    try {
      const data = term ? await searchBatches(term) : await getBatches();
      setBatches(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت دوره‌ها. لطفا دوباره تلاش کنید.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches(searchTerm);
  }, [searchTerm, fetchBatches]);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت دوره‌ها";
      toast.error(errorMessage);
    }
  };

  const fetchSeasons = async () => {
    try {
      const data = await getSeasons();
      setSeasons(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در دریافت فصل‌ها";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSeasons();
  }, []);

  const handleAddBatch = async () => {
    const errors = validateBatch(newBatch);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    setFormErrors({});
    try {
      await addBatch(newBatch);
      toast.success("دوره جدید با موفقیت اضافه شد");
      setNewBatch({
        course: "",
        season: "",
        title: "",
        min_age: "",
        max_age: "",
        schedule: "",
        location: "",
        capacity: "",
        allow_gateway: false,
        allow_receipt: false,
        allow_installment: false,
        price_gateway: "",
        price_receipt: "",
        price_installment: "",
        installment_count: 0,
        colleague_discount_percent: 0,
        loyalty_discount_percent: 0,
      });
      setShowAddForm(false);
      fetchBatches(searchTerm);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message ||"خطا در افزودن دوره";
      toast.error(errorMessage);
    }
  };

  const handleEditBatch = async () => {
    const errors = validateBatch(editingBatch);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("لطفا تمام فیلدهای ضروری را پر کنید");
      return;
    }

    setFormErrors({});
    try {
      await editBatch(editingBatch.id, { ...editingBatch });
      toast.success("ویرایش دوره با موفقیت انجام شد");
      setShowEditForm(false);
      setEditingBatch(null);
      fetchBatches(searchTerm);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در ویرایش دوره";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteBatch = (batch) => {
    setBatchToDelete(batch);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
  };

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch(batchToDelete.id);
      toast.success("دوره با موفقیت حذف شد");
      setShowDeleteConfirm(false);
      setBatchToDelete(null);
      fetchBatches(searchTerm);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "خطا در حذف دوره";
      toast.error(errorMessage);
    }
  };

  const handleEditClick = (batch) => {
    setEditingBatch({ ...batch });
    setShowEditForm(true);
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-mitra">
      <BatchHeader onAddClick={() => setShowAddForm(true)} />
      <BatchSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <BatchModal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setFormErrors({});
        }}
      >
        <BatchForm
          formData={newBatch}
          onChange={setNewBatch}
          onSubmit={handleAddBatch}
          onCancel={() => setShowAddForm(false)}
          courses={courses}
          seasons={seasons}
          errors={formErrors}
          isEdit={false}
        />
      </BatchModal>

      <BatchModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingBatch(null);
          setFormErrors({});
        }}
      >
        <BatchForm
          formData={editingBatch || {}}
          onChange={setEditingBatch}
          onSubmit={handleEditBatch}
          onCancel={() => {
            setShowEditForm(false);
            setEditingBatch(null);
          }}
          courses={courses}
          seasons={seasons}
          errors={formErrors}
          isEdit={true}
        />
      </BatchModal>

      <BatchModal isOpen={showDeleteConfirm} onClose={cancelDelete}>
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={cancelDelete}
          onConfirm={handleDeleteBatch}
          batchTitle={batchToDelete?.title || ""}
        />
      </BatchModal>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
          ></motion.div>
        </div>
      ) : (
        <BatchList
          batches={batches}
          courses={courses}
          seasons={seasons}
          onEdit={handleEditClick}
          onDelete={confirmDeleteBatch}
          searchTerm={searchTerm}
        />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        rtl={true}
      />
    </div>
  );
};

export default BatchesTab;
